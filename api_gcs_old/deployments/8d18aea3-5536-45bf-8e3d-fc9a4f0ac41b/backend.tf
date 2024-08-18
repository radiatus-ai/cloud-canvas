
terraform {
  backend "gcs" {
    bucket = "con-con-state-storage"
    prefix = "projects/ec22904d-5adf-4900-a2ad-4ada47943767/packages/8d18aea3-5536-45bf-8e3d-fc9a4f0ac41b"
  }
}
