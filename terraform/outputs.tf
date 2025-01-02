output "ecr_repo_name" {
  description = "The name of the ECR repository"
  value       = aws_ecr_repository.ecr_repo.name
}

output "alb_dns_name" {
  value = aws_alb.app_load_balancer.dns_name
}
