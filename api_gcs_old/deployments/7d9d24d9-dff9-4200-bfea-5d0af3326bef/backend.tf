
terraform {
  backend "gcs" {
    bucket = "rad-cc-demo"
    prefix = "projects/d67e1235-8f75-4bcf-b4a2-ac773df73c1b/packages/7d9d24d9-dff9-4200-bfea-5d0af3326bef"
  }
}
