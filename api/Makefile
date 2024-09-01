start:
	$(gcloud beta emulators pubsub env-init)
	poetry run opentelemetry-instrument uvicorn app.main:app --host=0.0.0.0 --port=8000 --reload

test:
	poetry run pytest tests -W ignore::DeprecationWarning

gen-openapi-spec:
	poetry run python scripts/gen_openapi_spec.py

migrate:
	poetry run alembic revision --autogenerate -m "init db"
	poetry run alembic upgrade head

upload:
	docker-compose build api-deploy && \
        docker tag platform-api-api-deploy:latest us-west2-docker.pkg.dev/ada-test-1234/ada/platform-api:latest && \
				docker push us-west2-docker.pkg.dev/ada-test-1234/ada/platform-api:latest && \
				gcloud run deploy platform-api \
					--image=us-west2-docker.pkg.dev/ada-test-1234/ada/platform-api:latest \
					--execution-environment=gen2 \
					--region=us-west2 \
					--project=ada-test-1234 \
					&& gcloud run services update-traffic platform-api --to-latest --region us-west2

start-pubsub-emulator:
	$(gcloud beta emulators pubsub env-init)
	gcloud beta emulators pubsub start --project=rad-dev --host-port=0.0.0.0:8192 || { echo "Pubsub emulator failed to start. Cleaning up..."; pkill -f "pubsub"; }

start-pubsub-emulator-ui:
	docker run -p 4200:80 ghcr.io/neoscript/pubsub-emulator-ui:latest
# ps aux | grep pubsub | grep host | awk '{ print $2}' | xargs kill -9

# for testing the endpoint, only during initial setup
test-pubsub:
	curl -X POST "http://127.0.0.1:8000/publish" -H "Content-Type: application/json" -d '{"message": "Hello, Pub/Sub!"}'

flake:
	poetry run lint
	poetry run autoflake
