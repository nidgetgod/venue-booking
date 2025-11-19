.PHONY: help build push deploy clean test version-bump version-release helm-package

# Configuration variables
REGISTRY ?= ghcr.io
IMAGE_NAME ?= nidgetgod/venue-booking
VERSION ?= $(shell node -p "require('./package.json').version")
IMAGE_TAG = $(REGISTRY)/$(IMAGE_NAME):v$(VERSION)
HELM_RELEASE = venue-booking
NAMESPACE = venue-booking
HELM_CHART_DIR = charts/venue-booking
HELM_PACKAGE_DIR = charts/packages

help: ## Display this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build Docker image
	@echo "Building Docker image: $(IMAGE_TAG)"
	docker build -t $(IMAGE_TAG) .

build-multiplatform: ## Build multi-platform Docker image
	@echo "Building multi-platform Docker image: $(IMAGE_TAG)"
	docker buildx build --platform linux/amd64,linux/arm64 -t $(IMAGE_TAG) --push .

push: ## Push Docker image to registry
	@echo "Pushing image: $(IMAGE_TAG)"
	docker push $(IMAGE_TAG)

run: ## Run Docker container locally
	@echo "Running container on port 3000..."
	docker run -p 3000:3000 --rm \
		-e NODE_ENV=production \
		$(IMAGE_TAG)

test-image: ## Test Docker image
	@echo "Testing image..."
	docker run --rm $(IMAGE_TAG) node -v
	docker run --rm $(IMAGE_TAG) npm -v

helm-lint: ## Lint Helm chart
	@echo "Linting Helm chart..."
	helm lint charts/venue-booking

helm-template: ## Render Helm templates
	@echo "Rendering Helm templates..."
	helm template $(HELM_RELEASE) charts/venue-booking --namespace $(NAMESPACE)

helm-install: ## Install Helm chart
	@echo "Installing Helm chart..."
	helm install $(HELM_RELEASE) $(HELM_CHART_DIR) \
		--namespace $(NAMESPACE) \
		--create-namespace \
		--set image.repository=$(REGISTRY)/$(IMAGE_NAME) \
		--set image.tag=v$(VERSION)

helm-upgrade: ## Upgrade Helm chart
	@echo "Upgrading Helm chart..."
	helm upgrade --install $(HELM_RELEASE) $(HELM_CHART_DIR) \
		--namespace $(NAMESPACE) \
		--set image.repository=$(REGISTRY)/$(IMAGE_NAME) \
		--set image.tag=v$(VERSION)

helm-uninstall: ## Uninstall Helm chart
	@echo "Uninstalling Helm chart..."
	helm uninstall $(HELM_RELEASE) --namespace $(NAMESPACE)

deploy: build push helm-upgrade ## Full deployment workflow (build, push, upgrade)
	@echo "Deployment complete!"

k8s-status: ## Check Kubernetes resource status
	@echo "Checking deployment status..."
	kubectl get all -n $(NAMESPACE)
	@echo "\nChecking ingress..."
	kubectl get ingress -n $(NAMESPACE)

k8s-logs: ## View application logs
	kubectl logs -f deployment/$(HELM_RELEASE) -n $(NAMESPACE)

k8s-describe: ## Describe deployment
	kubectl describe deployment/$(HELM_RELEASE) -n $(NAMESPACE)

k8s-shell: ## Access container shell
	kubectl exec -it deployment/$(HELM_RELEASE) -n $(NAMESPACE) -- sh

clean: ## Clean local Docker images
	@echo "Cleaning local images..."
	docker rmi $(IMAGE_TAG) || true

dev: ## Run in local development mode
	npm run dev

test: ## Run tests
	npm test

test-coverage: ## Run tests with coverage report
	npm run test:coverage

lint: ## Run linting
	npm run lint

# Version management
version-bump: ## Bump version (usage: make version-bump NEW_VERSION=1.2.2)
	@if [ -z "$(NEW_VERSION)" ]; then \
		echo "Error: NEW_VERSION is required (e.g., make version-bump NEW_VERSION=1.2.2)"; \
		exit 1; \
	fi
	@echo "Bumping version from $(VERSION) to $(NEW_VERSION)..."
	@./scripts/version-bump.sh $(NEW_VERSION)

helm-package: ## Package Helm chart
	@echo "Packaging Helm chart..."
	@mkdir -p $(HELM_PACKAGE_DIR)
	@helm package $(HELM_CHART_DIR) -d $(HELM_PACKAGE_DIR)
	@echo "Updating Helm repository index..."
	@helm repo index $(HELM_PACKAGE_DIR) --url https://nidgetgod.github.io/venue-booking/charts/packages
	@echo "Helm chart packaged successfully!"

version-release: build push helm-package ## Complete version release workflow (build image, push, package helm chart)
	@echo "Version $(VERSION) release complete!"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Commit changes: git add . && git commit -m 'chore: release v$(VERSION)'"
	@echo "  2. Create git tag: git tag v$(VERSION)"
	@echo "  3. Push to remote: git push origin main --tags"
	@echo "  4. Deploy with Helm chart: make helm-upgrade VERSION=$(VERSION)"
