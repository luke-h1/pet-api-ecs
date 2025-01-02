provider "aws" {
  region = "eu-west-2"
}

terraform {
  backend "s3" {
    bucket  = "pets-api-lho"
    key     = "terraform.tfstate"
    region  = "eu-west-2"
    encrypt = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
}