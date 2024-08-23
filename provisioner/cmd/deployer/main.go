// cmd/deployer/main.go

package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

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

	// Set up HTTP server
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Deployer is running")
	})

	// Get PORT from environment variable
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not set
	}

	// Start HTTP server
	// go func() {
	// 	log.Printf("Starting HTTP server on port %s", port)
	// 	if err := http.ListenAndServe(":"+port, nil); err != nil {
	// 		log.Fatalf("Failed to start HTTP server: %v", err)
	// 	}
	// }()

	log.Printf("Listening for messages on projects/%s/subscriptions/%s", cfg.ProjectID, cfg.SubscriptionID)
	if err := subscriber.Listen(ctx); err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
}
