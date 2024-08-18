
terraform {
  backend "gcs" {
    bucket = "rad-cc-demo"
    prefix = "projects/d67e1235-8f75-4bcf-b4a2-ac773df73c1b/packages/0d9a175d-8257-4c1e-bc5a-a0ad06bde2a4"
  }
}
