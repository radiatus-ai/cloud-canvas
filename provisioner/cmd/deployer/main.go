// cmd/deployer/main.go

package main

import (
	"context"
	"log"

	"github.com/radiatus-ai/package-provisioner/internal/config"
	"github.com/radiatus-ai/package-provisioner/internal/deployer"
	"github.com/radiatus-ai/package-provisioner/internal/pubsub"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	ctx := context.Background()
	deployer := deployer.NewDeployer(cfg)
	subscriber := pubsub.NewSubscriber(cfg, deployer.DeployPackage)

	log.Printf("Listening for messages on projects/%s/subscriptions/%s", cfg.ProjectID, cfg.SubscriptionID)
	if err := subscriber.Listen(ctx); err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
}
