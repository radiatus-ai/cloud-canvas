
terraform {
  backend "gcs" {
    bucket = "rad-cc-demo"
    prefix = "projects/d67e1235-8f75-4bcf-b4a2-ac773df73c1b/packages/744f530b-27a9-466e-af60-2c2d45f4561b"
  }
}
