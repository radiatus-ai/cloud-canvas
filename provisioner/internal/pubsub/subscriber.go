package pubsub

import (
	"context"
	"encoding/json"
	"log"
	"os"

	"github.com/radiatus-ai/package-provisioner/internal/config"
	"github.com/radiatus-ai/package-provisioner/pkg/models"
	"google.golang.org/api/option"

	"cloud.google.com/go/pubsub"
)

type Subscriber struct {
	cfg      *config.Config
	deployFn func(models.DeploymentMessage) error
}

func NewSubscriber(cfg *config.Config, deployFn func(models.DeploymentMessage) error) *Subscriber {
	return &Subscriber{
		cfg:      cfg,
		deployFn: deployFn,
	}
}

func (s *Subscriber) Listen(ctx context.Context) error {
	var client *pubsub.Client
	var err error

	if os.Getenv("PUBSUB_EMULATOR_HOST") != "" {
		client, err = pubsub.NewClient(ctx, s.cfg.ProjectID, option.WithEndpoint(os.Getenv("PUBSUB_EMULATOR_HOST")))
	} else {
		client, err = pubsub.NewClient(ctx, s.cfg.ProjectID)
	}

	if err != nil {
		return err
	}
	defer client.Close()

	sub := client.Subscription(s.cfg.SubscriptionID)

	return sub.Receive(ctx, func(ctx context.Context, msg *pubsub.Message) {
		log.Printf("Received message: %s", string(msg.Data))

		var deploymentMsg models.DeploymentMessage
		if err := json.Unmarshal(msg.Data, &deploymentMsg); err != nil {
			log.Printf("Error unmarshaling message: %v", err)
			msg.Nack()
			return
		}

		if err := s.deployFn(deploymentMsg); err != nil {
			log.Printf("Error deploying package: %v", err)
			msg.Nack()
			return
		}

		msg.Ack()
	})
}
