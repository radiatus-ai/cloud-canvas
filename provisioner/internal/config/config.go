package config

import (
	"fmt"
	"os"
)

type Config struct {
	ProjectID      string
	SubscriptionID string
	BucketName     string
}

func Load() (*Config, error) {
	cfg := &Config{
		ProjectID:      os.Getenv("GOOGLE_CLOUD_PROJECT"),
		SubscriptionID: os.Getenv("PUBSUB_SUBSCRIPTION_ID"),
		BucketName:     os.Getenv("BUCKET_NAME"),
	}

	if cfg.ProjectID == "" || cfg.SubscriptionID == "" || cfg.BucketName == "" {
		return nil, fmt.Errorf("missing required environment variables")
	}

	return cfg, nil
}
