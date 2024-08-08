build:
	docker compose build api-deploy ui-deploy

tag:
	docker tag cloud-canvas-api-deploy:latest us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/api:latest
	docker tag cloud-canvas-ui-deploy:latest us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/ui:latest

upload: build tag
	docker push us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/api:latest
	docker push us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/ui:latest
