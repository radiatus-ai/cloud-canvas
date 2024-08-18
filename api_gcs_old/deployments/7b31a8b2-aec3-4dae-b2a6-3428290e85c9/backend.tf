
terraform {
  backend "gcs" {
    bucket = "con-con-state-storage"
    prefix = "projects/ec22904d-5adf-4900-a2ad-4ada47943767/packages/7b31a8b2-aec3-4dae-b2a6-3428290e85c9"
  }
}
