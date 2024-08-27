gen-clients:
	cd api && make gen-openapi-spec
	openapi-generator-cli generate -i data/openapi-spec.yaml -g javascript -o ./ui/canvas-client
	./cleanup-gen-ui-client.sh
	rm -rf ./ui/canvas-client/dist
	cd ui/canvas-client && npm run build
	cd ui && npm install
	echo "UI client generated and built"

build:
	docker compose build api-deploy ui-deploy

tag:
	docker tag cloud-canvas-api-deploy:latest us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/api:latest
	docker tag cloud-canvas-ui-deploy:latest us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/ui:latest
# docker tag cloud-canvas-provisioner-deploy:latest us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/provisioner:latest

upload: build tag
	docker push us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/api:latest
	docker push us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/ui:latest
# docker push us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/provisioner:latest


deploy: build tag upload
	gcloud run deploy ui \
		--image=us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/ui:latest \
		--execution-environment=gen2 \
		--region=us-central1 \
		--project=rad-dev-canvas-kwm6 \
		&& gcloud run services update-traffic ui --to-latest --region us-central1 --project=rad-dev-canvas-kwm6


# it's incredible how easy it was to set this up.
# should have done this forever ago.
build-cloudbuild:
	gcloud builds submit --project=rad-containers-hmed --config=cloudbuild.yaml .

deploy-cloudbuild: build-cloudbuild
	kubectl delete pods --selector=app=api
	gcloud run deploy ui \
		--image=us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/ui:latest \
		--execution-environment=gen2 \
		--region=us-central1 \
		--project=rad-dev-canvas-kwm6 \
		&& gcloud run services update-traffic ui --to-latest --region us-central1 --project=rad-dev-canvas-kwm6

build-cloudbuild-kaniko:
# $(eval export SHORT_SHA=$(shell git rev-parse --short HEAD))
	$(eval export SHORT_SHA=$(shell openssl rand -hex 3))
	gcloud builds submit --project=rad-containers-hmed --config=cloudbuild-kaniko.yaml --substitutions=SHORT_SHA=$(SHORT_SHA) .

deploy-cloudbuild-kaniko: build-cloudbuild-kaniko
	kubectl set image deployment/api api=us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/api:$(SHORT_SHA)
	kubectl rollout status deployment/api
	gcloud run deploy ui \
		--image=us-central1-docker.pkg.dev/rad-containers-hmed/cloud-canvas/ui:latest \
		--execution-environment=gen2 \
		--region=us-central1 \
		--project=rad-dev-canvas-kwm6 \
		&& gcloud run services update-traffic ui --to-latest --region us-central1 --project=rad-dev-canvas-kwm6
