resource "aws_cloudwatch_log_group" "log_group" {
  name = "${var.project_name}-${var.env}-cluster-logs"

  tags = merge(var.tags, {
    "Name" = "${var.project_name}-${var.env}-cluster-logs"
  })
}