
terraform {
  backend "gcs" {
    bucket = "rad-cc-demo"
    prefix = "projects/d67e1235-8f75-4bcf-b4a2-ac773df73c1b/packages/5ffeb767-b614-4feb-97e9-40a2fc29fd0e"
  }
}
