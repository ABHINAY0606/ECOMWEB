# Azure Deployment Guide

This guide details how to deploy the E-Commerce Order Management System to Azure using Azure Container Apps (ACA) or Azure Container Instances (ACI).

## Prerequisites
- Azure CLI installed and logged in (`az login`).
- Docker installed.
- A valid Azure Subscription (not a restricted lab environment if possible).

## 1. Push Images to Docker Hub
Ensure your images are built and pushed:
```bash
docker login
docker build -t <your-dockerhub-user>/order-backend:v1 ./Order-Management
docker build -t <your-dockerhub-user>/ecom-frontend:v1 ./ecommerceorder-frontend
docker push <your-dockerhub-user>/order-backend:v1
docker push <your-dockerhub-user>/ecom-frontend:v1
```

## 2. Deploy to Azure Container Apps (Recommended)
### Create Resource Group
```bash
az group create --name EcommerceRG --location eastus
```

### Create Environment
```bash
az containerapp env create --name ecom-app-env --resource-group EcommerceRG --location eastus
```

### Deploy Backend
```bash
az containerapp create --name order-backend --resource-group EcommerceRG --environment ecom-app-env --image <your-dockerhub-user>/order-backend:v1 --target-port 8080 --ingress external --query properties.configuration.ingress.fqdn
```
*Note: Copy the FQDN output.*

### Update Frontend
Update `src/app/services/*.service.ts` with the Backend FQDN. Rebuild and push the frontend image.

### Deploy Frontend
```bash
az containerapp create --name ecom-frontend --resource-group EcommerceRG --environment ecom-app-env --image <your-dockerhub-user>/ecom-frontend:v1 --target-port 80 --ingress external
```

### Deploy Database
It is valid to use a Managed MySQL instance or a containerized MySQL:
```bash
az containerapp create --name ecom-db --resource-group EcommerceRG --environment ecom-app-env --image mysql:8.0 --env-vars MYSQL_ROOT_PASSWORD=root MYSQL_DATABASE=ecom_db --transport tcp --exposed-port 3306 --target-port 3306 --ingress internal
```

## 3. GitHub Actions
The `.github/workflows/deploy.yml` file is configured to build and push images. Ensure you set `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` in your repository secrets.
