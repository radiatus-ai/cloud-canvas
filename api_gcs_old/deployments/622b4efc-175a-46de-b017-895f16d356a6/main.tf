resource "google_compute_subnetwork" "main" {
  name          = var.name
  ip_cidr_range = "10.2.0.0/16"
  region        = "us-central1"
  network       = var.network.id
}
