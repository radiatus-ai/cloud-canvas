test:
	go test ./...

start:
	go run cmd/deployer/main.go

build:
	CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o dist/main ./cmd/deployer/main.go

upload:
	docker compose build provisioner-deploy && \
        docker tag cloud-canvas-provisioner-deploy:latest us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/provisioner:latest && \
				docker push us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/provisioner:latest && \
				gcloud run deploy provisioner \
					--image=us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/provisioner:latest \
					--execution-environment=gen2 \
					--region=us-central1 \
					--project=rad-dev-canvas-kwm6 \
					&& gcloud run services update-traffic provisioner --to-latest --region us-central1 --project=rad-dev-canvas-kwm6
