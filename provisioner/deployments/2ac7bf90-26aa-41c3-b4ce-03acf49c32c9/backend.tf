
terraform {
  backend "gcs" {
    bucket = "rad-provisioner-state-1234"
    prefix = "projects/f65e6aec-7716-41ae-a659-d8a2a0de2d32/packages/2ac7bf90-26aa-41c3-b4ce-03acf49c32c9"
  }
}
