package pubsub

import (
	"context"
	"encoding/json"
	"os"
	"testing"
	"time"

	"github.com/radiatus-ai/package-provisioner/internal/config"
	"github.com/radiatus-ai/package-provisioner/pkg/models"

	"cloud.google.com/go/pubsub"
)

func TestSubscriber_Listen(t *testing.T) {
	// Skip this test if not running in the Pub/Sub emulator
	if os.Getenv("PUBSUB_EMULATOR_HOST") == "" {
		t.Skip("Skipping integration test: Pub/Sub emulator not running")
	}

	ctx := context.Background()
	projectID := "test-project"
	topicID := "test-topic"
	subscriptionID := "test-subscription"

	// Create a Pub/Sub client
	client, err := pubsub.NewClient(ctx, projectID)
	if err != nil {
		t.Fatalf("Failed to create client: %v", err)
	}
	defer client.Close()

	// Create a topic and subscription
	topic, err := client.CreateTopic(ctx, topicID)
	if err != nil {
		t.Fatalf("Failed to create topic: %v", err)
	}
	defer topic.Delete(ctx)

	sub, err := client.CreateSubscription(ctx, subscriptionID, pubsub.SubscriptionConfig{Topic: topic})
	if err != nil {
		t.Fatalf("Failed to create subscription: %v", err)
	}
	defer sub.Delete(ctx)

	// Create a test config and subscriber
	cfg := &config.Config{
		ProjectID:      projectID,
		SubscriptionID: subscriptionID,
	}

	deploymentCount := 0
	testDeployFn := func(msg models.DeploymentMessage) error {
		deploymentCount++
		return nil
	}

	subscriber := NewSubscriber(cfg, testDeployFn)

	// Start listening in a goroutine
	errCh := make(chan error)
	go func() {
		errCh <- subscriber.Listen(ctx)
	}()

	// Publish a test message
	testMsg := models.DeploymentMessage{
		ProjectID: "test-project",
		PackageID: "test-package",
	}
	msgBytes, _ := json.Marshal(testMsg)
	topic.Publish(ctx, &pubsub.Message{Data: msgBytes})

	// Wait for the message to be processed
	time.Sleep(5 * time.Second)

	// Check if the deployment function was called
	if deploymentCount != 1 {
		t.Errorf("Expected 1 deployment, got %d", deploymentCount)
	}

	// Cancel the context to stop listening
	ctx.Done()

	// Check for any errors from the listener
	select {
	case err := <-errCh:
		if err != nil {
			t.Errorf("Listen() error = %v", err)
		}
	case <-time.After(1 * time.Second):
		t.Error("Listen() did not return after context cancellation")
	}
}
