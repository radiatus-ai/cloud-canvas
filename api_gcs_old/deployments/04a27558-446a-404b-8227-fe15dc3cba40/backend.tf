
terraform {
  backend "gcs" {
    bucket = "con-con-state-storage"
    prefix = "projects/ec22904d-5adf-4900-a2ad-4ada47943767/packages/04a27558-446a-404b-8227-fe15dc3cba40"
  }
}
