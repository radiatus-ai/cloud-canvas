package terraform

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/radiatus-ai/package-provisioner/internal/config"
	"github.com/radiatus-ai/package-provisioner/pkg/models"
)

type Executor struct {
	cfg *config.Config
}

func NewExecutor(cfg *config.Config) *Executor {
	return &Executor{cfg: cfg}
}

func (e *Executor) CopyTerraformModules(packageType, deployDir string) error {
	sourceDir := filepath.Join("terraform-modules", packageType)
	return exec.Command("cp", "-R", sourceDir+"/*", deployDir).Run()
}

func (e *Executor) CreateParameterFile(msg models.DeploymentMessage, deployDir string) error {
	combinedData := make(map[string]interface{})
	for k, v := range msg.Package.ParameterData {
		combinedData[k] = v
	}
	for k, v := range msg.ConnectedInputData {
		combinedData[k] = v
	}

	return e.writeJSONFile(filepath.Join(deployDir, fmt.Sprintf("%s_inputs.auto.tfvars.json", msg.PackageID)), combinedData)
}

func (e *Executor) CreateBackendFile(msg models.DeploymentMessage, deployDir string) error {
	prefix := fmt.Sprintf("projects/%s/packages/%s", msg.ProjectID, msg.PackageID)
	content := fmt.Sprintf(`
terraform {
  backend "gcs" {
    bucket = "%s"
    prefix = "%s"
  }
}
`, e.cfg.BucketName, prefix)

	return os.WriteFile(filepath.Join(deployDir, "backend.tf"), []byte(content), 0644)
}

func (e *Executor) RunTerraformCommands(deployDir string) error {
	commands := []string{
		"terraform init",
		"terraform plan",
		"terraform apply -auto-approve",
	}

	for _, cmd := range commands {
		if output, err := e.runCommand(cmd, deployDir); err != nil {
			return fmt.Errorf("command '%s' failed: %v\nOutput: %s", cmd, err, output)
		}
	}

	return nil
}

func (e *Executor) ProcessTerraformOutputs(msg models.DeploymentMessage, deployDir string) (map[string]interface{}, error) {
	output, err := e.runCommand("terraform output -json", deployDir)
	if err != nil {
		return nil, fmt.Errorf("failed to get terraform outputs: %v", err)
	}

	var outputJSON map[string]interface{}
	if err := json.Unmarshal([]byte(output), &outputJSON); err != nil {
		return nil, fmt.Errorf("failed to parse terraform outputs: %v", err)
	}

	processedOutput := make(map[string]interface{})
	for k, v := range outputJSON {
		if m, ok := v.(map[string]interface{}); ok {
			processedOutput[k] = m["value"]
		} else {
			processedOutput[k] = v
		}
	}

	outputData := make(map[string]interface{})
	for k := range msg.Package.Outputs {
		if v, ok := processedOutput[k]; ok {
			outputData[k] = v
		}
	}

	return outputData, nil
}

func (e *Executor) WriteOutputFile(packageID, deployDir string, outputData map[string]interface{}) error {
	return e.writeJSONFile(filepath.Join(deployDir, fmt.Sprintf("%s_output.json", packageID)), outputData)
}

func (e *Executor) runCommand(command, dir string) (string, error) {
	cmd := exec.Command("sh", "-c", command)
	cmd.Dir = dir
	output, err := cmd.CombinedOutput()
	return string(output), err
}

func (e *Executor) writeJSONFile(filepath string, data interface{}) error {
	file, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	return encoder.Encode(data)
}
