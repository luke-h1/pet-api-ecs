resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_policy" {
  role       = aws_iam_role.task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}


resource "aws_iam_role" "task_execution_role" {
  name = "${var.project_name}-${var.env}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = var.env
  }
}


resource "aws_iam_role_policy_attachment" "ecr_pull_policy" {
  role       = aws_iam_role.ecr_pull.name
  policy_arn = "arn:aws:iam::aws:policy/EC2InstanceProfileForImageBuilderECRContainerBuilds"
}

resource "aws_iam_role" "ecr_pull" {
  name = "${var.project_name}-${var.env}-ecr-pull-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ecr.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = var.env
  }
}

resource "aws_launch_template" "launch" {
  name_prefix   = "pets-api-"
  image_id      = "ami-0c0493bbac867d427"
  instance_type = "t2.micro"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "ag" {
  desired_capacity      = 1
  max_size              = 2
  min_size              = 1
  availability_zones    = ["eu-west-2a", "eu-west-2b", "eu-west-2c"]
  protect_from_scale_in = true
  launch_template {
    id      = aws_launch_template.launch.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "asg-pet-api-${var.env}"
    propagate_at_launch = true
  }
}


resource "aws_ecs_cluster_capacity_providers" "ecs" {
  cluster_name = aws_ecs_cluster.app_cluster.name

  capacity_providers = ["FARGATE_SPOT", "FARGATE"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE_SPOT"
  }
}

resource "aws_ecs_task_definition" "app_task" {
  family                = "${var.project_name}-${var.env}"
  container_definitions = <<DEFINITION
    [
      {
        "name": "${var.project_name}-${var.env}",
        "image": "${aws_ecr_repository.ecr_repo.repository_url}:${var.docker_image_tag}",
        "essential": true,
        "environment": [
          {
            "name": "API_BASE_URL",
            "value": "${var.api_base_url}"
          },
          {
            "name": "REDIS_URL",
            "value": "${var.redis_url}"
          },
          {
            "name": "DATABASE_URL",
            "value": "${var.database_url}"
          },
          {
            "name": "SESSION_SECRET",
            "value": "${var.session_secret}"
          },
          {
            "name": "DEPLOYED_BY",
            "value": "${var.deployed_by}"
          },
          {
            "name": "DEPLOYED_AT",
            "value": "${timestamp()}"
          },
          {
            "name": "ENVIRONMENT",
            "value": "${var.env}"
          },
          {
            "name": "S3_ASSETS_BUCKET",
            "value": "${var.s3_assets_bucket}"
          },
          {
            "name": "S3_ASSETS_BUCKET_REGION",
            "value": "${var.s3_assets_region}"
          },
          {
            "name": "S3_ASSETS_ACCESS_KEY_ID",
            "value": "${var.s3_assets_access_key_id}"
          },
          {
            "name": "S3_ASSETS_SECRET_ACCESS_KEY",
            "value": "${var.s3_assets_secret_access_key}"
          },
          {
            "name": "GIT_SHA",
            "value": "${var.git_sha}"
          },
          {
            "name": "SESSION_DOMAIN",
            "value": "${var.session_domain}"
          }
        ],
        "portMappings": [
          {
            "containerPort": 8000,
            "hostPort": 8000
          }
        ],
        "logConfiguration": {
          "logDriver": "awslogs",
          "options": {
            "awslogs-group": "${aws_cloudwatch_log_group.log_group.name}",
            "awslogs-region": "eu-west-2",
            "awslogs-stream-prefix": "${var.project_name}-"
          }
        },
        "memory": 512,
        "cpu": 256
      }
    ]
  DEFINITION
  cpu                   = 256
  network_mode          = "awsvpc"
  memory                = 512
  execution_role_arn    = aws_iam_role.task_execution_role.arn
  task_role_arn         = aws_iam_role.task_execution_role.arn
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }
}

resource "aws_security_group" "application_service_security_group" {
  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.app_load_balancer_security_group.id]
  }

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.app_load_balancer_security_group.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Environment = var.env
  }
}

resource "aws_ecs_service" "app_ecs" {
  name                               = "${var.project_name}-${var.env}-cluster"
  cluster                            = aws_ecs_cluster.app_cluster.id
  task_definition                    = aws_ecs_task_definition.app_task.arn
  desired_count                      = var.task_count
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 50 # Using 50% ensures the service is available but makes rolling updates much faster

  # Cause the deployment to fail and rollback if the service is unable to stabilize
  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app_target_group.arn
    container_name   = aws_ecs_task_definition.app_task.family
    container_port   = var.port
  }

  network_configuration {
    subnets          = [aws_default_subnet.application_subnet_a.id, aws_default_subnet.application_subnet_b.id, aws_default_subnet.application_subnet_c.id]
    assign_public_ip = true
    security_groups  = [aws_security_group.application_service_security_group.id]
  }

  triggers = {
    redeployment = timestamp()
  }


  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 2
    base              = 1
  }
}

resource "aws_ecs_cluster" "app_cluster" {
  name = "${var.project_name}-${var.env}-cluster"
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
