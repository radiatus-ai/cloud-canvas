
terraform {
  backend "gcs" {
    bucket = "rad-cc-demo"
    prefix = "projects/d67e1235-8f75-4bcf-b4a2-ac773df73c1b/packages/e99b8b09-8545-41ab-9de0-b9510cb29873"
  }
}
