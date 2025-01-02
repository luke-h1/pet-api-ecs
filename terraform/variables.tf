variable "docker_image_tag" {
  type        = string
  description = "value of the docker image tag"
}

variable "private_key" {
  type        = string
  description = "The private key to use for the certificate"
}

variable "certificate_body" {
  type        = string
  description = "The certificate body"
}

variable "certificate_chain" {
  type        = string
  description = "The certificate chain"
}

variable "project_name" {
  type        = string
  description = "The name of the project"
  default     = "pets-api"
}

variable "domain" {
  type        = string
  description = "The domain name to use"
  default     = "pets-staging.lhowsam.com"
}

variable "zone_id" {
  type        = string
  description = "The zone id for the route53 record"
}

variable "tags" {
  type        = map(string)
  description = "Tags to apply to all resources"
  default = {
    "project"    = "pets-api"
    "managed_by" = "terraform"
  }
}

variable "env" {
  type        = string
  description = "The environment to deploy to"
  default     = "staging"
}

variable "deployed_by" {
  type        = string
  description = "The name of the person deploying the application"
  default     = "luke-h1"
}


variable "deployed_at" {
  type        = string
  description = "Date of the deployment"
  default     = ""
}

variable "port" {
  type        = number
  description = "The port the container listens on"
  default     = 8000
}

variable "memory" {
  type        = number
  description = "The amount of memory to allocate to the container"
  default     = 512
}

variable "cpu" {
  type        = number
  description = "The amount of CPU units to allocate to the container"
  default     = 256
}

variable "task_count" {
  type        = number
  description = "The number of tasks to run"
  default     = 1
}

variable "health_check_path" {
  type        = string
  description = "The path to the health check endpoint"
  default     = "/api/healthcheck"
}

// env vars
variable "redis_url" {
  type        = string
  description = "The URL of the redis server"
}

variable "api_base_url" {
  type        = string
  description = "The base URL of the API"
  default     = "pets-staging.lhowsam.com"
}

variable "session_secret" {
  type        = string
  description = "The secret key for the session"
}

variable "database_url" {
  type        = string
  description = "The URL of the postgres database"
}

variable "session_domain" {
  type        = string
  description = "The domain to use for the session cookie. This should not start with https://"
  default     = "pets-staging.lhowsam.com"
}

variable "s3_assets_bucket" {
  type        = string
  description = "The name of the S3 bucket to store assets"
  default     = "pets-api-staging-assets"
}

variable "s3_assets_region" {
  type        = string
  description = "The region of the S3 bucket to store assets"
  default     = "eu-west-2"
}

variable "s3_assets_access_key_id" {
  type        = string
  description = "The access key id for the S3 bucket"
}

variable "s3_assets_secret_access_key" {
  type        = string
  description = "The secret access key to grant access to the s3 bucket"
}

variable "git_sha" {
  type        = string
  description = "The git sha of the commit being deployed"
}
