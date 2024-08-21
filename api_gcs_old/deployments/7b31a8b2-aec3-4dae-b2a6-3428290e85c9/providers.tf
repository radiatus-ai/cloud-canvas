terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.36.0"
    }
  }
}


provider "google" {
  project = "ada-test-1234"
}