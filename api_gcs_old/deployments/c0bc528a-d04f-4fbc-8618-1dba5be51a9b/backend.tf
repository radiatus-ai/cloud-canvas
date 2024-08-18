
terraform {
  backend "gcs" {
    bucket = "rad-cc-demo"
    prefix = "projects/d67e1235-8f75-4bcf-b4a2-ac773df73c1b/packages/c0bc528a-d04f-4fbc-8618-1dba5be51a9b"
  }
}
