resource "aws_default_vpc" "default_vpc" {
}

resource "aws_default_subnet" "app_subnet_a" {
  availability_zone = "eu-west-2a"
}

resource "aws_default_subnet" "app_subnet_b" {
  availability_zone = "eu-west-2b"
}

resource "aws_default_subnet" "app_subnet_c" {
  availability_zone = "eu-west-2c"
}

resource "aws_alb" "app_load_balancer" {
  name               = "${var.project_name}-${var.env}-lb"
  load_balancer_type = "application"
  subnets = [
    aws_default_subnet.application_subnet_a.id,
    aws_default_subnet.application_subnet_b.id,
    aws_default_subnet.application_subnet_c.id
  ]
  security_groups = [aws_security_group.app_load_balancer_security_group.id]
  tags = merge(var.tags, {
    "Name" = "${var.project_name}-${var.env}-lb"
  })
  preserve_host_header = true
}

resource "aws_security_group" "app_load_balancer_security_group" {
  name = "${var.project_name}-${var.env}-lb-security-group"
  tags = merge(var.tags, {
    "Name" = "${var.project_name}-${var.env}-lb-security-group"
  })

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb_target_group" "app_target_group" {
  name = "${var.project_name}-${var.env}-tg"
  tags = merge(var.tags, {
    "Name" = "${var.project_name}-${var.env}-tg"
  })
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_default_vpc.default_vpc.id
  health_check {
    matcher           = "200,301,302"
    path              = "/api/healthcheck"
    interval          = 120
    timeout           = 30
    healthy_threshold = 3
  }
  stickiness {
    cookie_name     = "lb"
    cookie_duration = 3600
    enabled         = true
    type            = "lb_cookie"
  }
}


# add a listener to redirect any http traffic to https
resource "aws_lb_listener" "web_http" {
  load_balancer_arn = aws_alb.app_load_balancer.arn
  port              = 80
  protocol          = "HTTP"
  tags = merge(var.tags, {
    "Name"        = "${var.project_name}-${var.env}-http-listener"
    "Description" = "Redirect HTTP to HTTPS listener"
  })
  default_action {
    type = "redirect"
    redirect {
      port        = 443
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_default_subnet" "application_subnet_a" {
  availability_zone = "eu-west-2a"
}

resource "aws_default_subnet" "application_subnet_b" {
  availability_zone = "eu-west-2b"
}

resource "aws_default_subnet" "application_subnet_c" {
  availability_zone = "eu-west-2c"
}

resource "aws_lb_listener_certificate" "cert" {
  certificate_arn = aws_acm_certificate.cert.arn
  listener_arn    = aws_lb_listener.web_https.arn
}

# forward https traffic to the target group
resource "aws_lb_listener" "web_https" {
  load_balancer_arn = aws_alb.app_load_balancer.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate.cert.arn
  tags = merge(var.tags, {
    "Name"        = "${var.project_name}-${var.env}-https-listener"
    "Description" = "Forward HTTPS traffic to the target group"
  })

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_target_group.arn
  }
}

resource "aws_security_group" "app_service_security_group" {
  tags = merge(var.tags, {
    "Name"        = "${var.project_name}-${var.env}-sg-group"
    "Description" = "Security group for ${var.project_name}-${var.env}"
  })


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
}
