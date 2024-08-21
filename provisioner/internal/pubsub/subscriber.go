package pubsub

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/radiatus-ai/package-provisioner/internal/config"
	"github.com/radiatus-ai/package-provisioner/pkg/models"
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
	http.HandleFunc("/push", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Only POST requests are allowed", http.StatusMethodNotAllowed)
			return
		}

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Printf("Error reading request body: %v", err)
			http.Error(w, "Error reading request", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		var pushRequest struct {
			Message struct {
				Data []byte `json:"data,omitempty"`
				ID   string `json:"id"`
			} `json:"message"`
		}

		if err := json.Unmarshal(body, &pushRequest); err != nil {
			log.Printf("Error unmarshaling push request: %v", err)
			http.Error(w, "Error processing message", http.StatusBadRequest)
			return
		}

		log.Printf("Received message: %s", string(pushRequest.Message.Data))

		var deploymentMsg models.DeploymentMessage
		if err := json.Unmarshal(pushRequest.Message.Data, &deploymentMsg); err != nil {
			log.Printf("Error unmarshaling message: %v", err)
			http.Error(w, "Error processing message", http.StatusBadRequest)
			return
		}

		if err := s.deployFn(deploymentMsg); err != nil {
			log.Printf("Error deploying package: %v", err)
			http.Error(w, "Error processing message", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	})

	log.Printf("Starting HTTP server on port 8080")
	return http.ListenAndServe(":8080", nil)
}
