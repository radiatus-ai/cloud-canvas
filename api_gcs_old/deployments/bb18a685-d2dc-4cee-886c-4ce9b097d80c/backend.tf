
terraform {
  backend "gcs" {
    bucket = "rad-cc-demo"
    prefix = "projects/d67e1235-8f75-4bcf-b4a2-ac773df73c1b/packages/bb18a685-d2dc-4cee-886c-4ce9b097d80c"
  }
}
