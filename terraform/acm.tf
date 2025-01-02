# create an entry in route53 for the load balancer and the given domain
resource "aws_acm_certificate" "cert" {
  private_key       = var.private_key
  certificate_body  = var.certificate_body
  certificate_chain = var.certificate_chain
  tags = {
    Name    = "certificate for ${var.env}"
    stage   = var.env
    service = "pets-api"
  }
}


resource "aws_acm_certificate" "root_domain" {
  provider          = aws.us-east-1
  domain_name       = var.domain
  validation_method = "DNS"
  lifecycle {
    create_before_destroy = true

    # only set to false because we might need to do a full teardown
    prevent_destroy = false
  }
}

data "aws_route53_zone" "domain" {
  private_zone = false
  zone_id      = var.zone_id
}


resource "aws_route53_record" "alb" {
  zone_id = data.aws_route53_zone.domain.zone_id
  name    = var.domain
  type    = "A"

  alias {
    name                   = aws_alb.app_load_balancer.dns_name
    zone_id                = aws_alb.app_load_balancer.zone_id
    evaluate_target_health = true
  }
}

resource "aws_acm_certificate" "domain" {
  domain_name       = var.domain
  validation_method = "DNS"
  tags = merge(var.tags, {
    "Name"        = "${var.project_name}-${var.env}-certificate"
    "Description" = "Certificate for ${var.project_name}-${var.env}"
  })

  lifecycle {
    create_before_destroy = true

    # only set to false because we might need to do a full teardown
    prevent_destroy = false
  }
}

# resource "aws_route53_zone" "zone" {
#   name          = var.domain
#   force_destroy = false
#   comment       = "Zone for ${var.domain}"
#   tags = merge(var.tags, {
#     "Name"        = "${var.project_name}-${var.env}-route53-zone"
#     "Description" = "Route53 zone for ${var.project_name}-${var.env}"
#   })
# }

# data "aws_route53_zone" "domain" {
#   private_zone = false
#   zone_id      = aws_route53_zone.zone.zone_id
#   tags = merge(var.tags, {
#     "Name"        = "${var.project_name}-${var.env}-route53-zone"
#     "Description" = "Route53 zone for ${var.project_name}-${var.env}"
#   })
# }

# resource "aws_route53_record" "domain" {
#   for_each = {
#     for dvo in aws_acm_certificate.domain.domain_validation_options : dvo.domain_name => {
#       name   = dvo.resource_record_name
#       record = dvo.resource_record_value
#       type   = dvo.resource_record_type
#     }
#   }

#   allow_overwrite = true
#   name            = each.value.name
#   records         = [each.value.record]
#   ttl             = 60
#   type            = each.value.type
#   zone_id         = data.aws_route53_zone.domain.zone_id
# }

# resource "aws_acm_certificate_validation" "domain" {
#   certificate_arn         = aws_acm_certificate.domain.arn
#   validation_record_fqdns = [for record in aws_route53_record.domain : record.fqdn]
# }
