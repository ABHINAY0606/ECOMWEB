# Azure Deployment Guide

This guide details how to deploy the E-Commerce Order Management System to Azure using Azure App Service with the **frontend (Nginx + Angular) as the main container** that proxies API requests to the backend.

## Architecture Overview

- **Frontend App Service**: Nginx serving Angular application and proxying `/api/*` requests to backend
- **Backend App Service**: Spring Boot application with REST API
- **Database**: Azure Database for MySQL (Flexible Server) or containerized MySQL

## Prerequisites

- Azure CLI installed and logged in (`az login`)
- Docker installed
- Docker Hub account
- A valid Azure Subscription

## Quick Start - Automated Deployment

### Option 1: Using PowerShell (Windows)

```powershell
# 1. Build and push Docker images
.\build-and-push.ps1

# 2. Deploy to Azure
.\deploy-app-service.ps1
```

### Option 2: Using Bash (Linux/Mac/WSL)

```bash
# 1. Build and push Docker images
chmod +x build-and-push.sh
./build-and-push.sh

# 2. Deploy to Azure
chmod +x deploy-app-service.sh
./deploy-app-service.sh
```

## Manual Deployment Steps

### Step 1: Build and Push Docker Images

Update the Docker Hub username in the commands below:

```bash
# Login to Docker Hub
docker login

# Build images
docker build -t <your-dockerhub-user>/order-backend:v1 ./Order-Management
docker build -t <your-dockerhub-user>/ecom-frontend:v1 ./ecommerceorder-frontend

# Push images
docker push <your-dockerhub-user>/order-backend:v1
docker push <your-dockerhub-user>/ecom-frontend:v1
```

### Step 2: Create Azure Resources

```bash
# Create Resource Group
az group create --name EcommerceRG --location eastus

# Create App Service Plan (Linux, B1 SKU)
az appservice plan create \
  --name ecom-app-plan \
  --resource-group EcommerceRG \
  --location eastus \
  --is-linux \
  --sku B1
```

### Step 3: Create Azure Database for MySQL

```bash
# Create MySQL Flexible Server
az mysql flexible-server create \
  --name ecom-mysql-server \
  --resource-group EcommerceRG \
  --location eastus \
  --admin-user ecomadmin \
  --admin-password <YourSecurePassword> \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 8.0 \
  --storage-size 32 \
  --public-access 0.0.0.0-255.255.255.255

# Create database
az mysql flexible-server db create \
  --resource-group EcommerceRG \
  --server-name ecom-mysql-server \
  --database-name ecom_db
```

### Step 4: Deploy Backend App Service

```bash
# Create backend web app
az webapp create \
  --resource-group EcommerceRG \
  --plan ecom-app-plan \
  --name order-backend-app \
  --deployment-container-image-name <your-dockerhub-user>/order-backend:v1

# Configure environment variables
az webapp config appsettings set \
  --resource-group EcommerceRG \
  --name order-backend-app \
  --settings \
    SPRING_DATASOURCE_URL="jdbc:mysql://ecom-mysql-server.mysql.database.azure.com:3306/ecom_db?useSSL=true&requireSSL=false" \
    SPRING_DATASOURCE_USERNAME="ecomadmin" \
    SPRING_DATASOURCE_PASSWORD="<YourSecurePassword>" \
    SPRING_JPA_HIBERNATE_DDL_AUTO="update" \
    SPRING_JPA_SHOW_SQL="false" \
    WEBSITES_PORT="8080"
```

### Step 5: Deploy Frontend App Service

```bash
# Get backend URL
BACKEND_URL="https://order-backend-app.azurewebsites.net"

# Create frontend web app
az webapp create \
  --resource-group EcommerceRG \
  --plan ecom-app-plan \
  --name ecom-frontend-app \
  --deployment-container-image-name <your-dockerhub-user>/ecom-frontend:v1

# Configure environment variables (including backend URL for proxy)
az webapp config appsettings set \
  --resource-group EcommerceRG \
  --name ecom-frontend-app \
  --settings \
    BACKEND_URL="$BACKEND_URL" \
    WEBSITES_PORT="80"
```

### Step 6: Enable Logging and Restart

```bash
# Enable container logging
az webapp log config \
  --resource-group EcommerceRG \
  --name order-backend-app \
  --docker-container-logging filesystem

az webapp log config \
  --resource-group EcommerceRG \
  --name ecom-frontend-app \
  --docker-container-logging filesystem

# Restart applications
az webapp restart --resource-group EcommerceRG --name order-backend-app
az webapp restart --resource-group EcommerceRG --name ecom-frontend-app
```

## Accessing Your Application

- **Frontend URL**: `https://ecom-frontend-app.azurewebsites.net`
- **Backend URL**: `https://order-backend-app.azurewebsites.net`

The frontend Nginx configuration automatically proxies all `/api/*` requests to the backend App Service.

## Monitoring and Troubleshooting

### View Logs

```bash
# Frontend logs
az webapp log tail --resource-group EcommerceRG --name ecom-frontend-app

# Backend logs
az webapp log tail --resource-group EcommerceRG --name order-backend-app
```

### Common Issues

1. **Container not starting**: Check logs and verify environment variables
2. **API calls failing**: Verify `BACKEND_URL` is set correctly in frontend
3. **Database connection errors**: Check MySQL firewall rules and connection string

## Alternative Deployment Options

### Deploy to Azure Container Apps (ACA)

For more advanced scenarios with better scaling:

```bash
# Create environment
az containerapp env create \
  --name ecom-app-env \
  --resource-group EcommerceRG \
  --location eastus

# Deploy backend
az containerapp create \
  --name order-backend \
  --resource-group EcommerceRG \
  --environment ecom-app-env \
  --image <your-dockerhub-user>/order-backend:v1 \
  --target-port 8080 \
  --ingress external

# Deploy frontend
az containerapp create \
  --name ecom-frontend \
  --resource-group EcommerceRG \
  --environment ecom-app-env \
  --image <your-dockerhub-user>/ecom-frontend:v1 \
  --target-port 80 \
  --ingress external \
  --env-vars BACKEND_URL=<backend-fqdn>
```

## Configuration Details

### Frontend Configuration

The frontend container uses:
- **Nginx** to serve Angular static files
- **Environment variable substitution** for dynamic backend URL
- **API proxying** at `/api/*` location
- **CORS headers** for cross-origin requests

### Backend Configuration

The backend uses:
- **Spring Boot** with embedded Tomcat
- **Environment variables** for database configuration
- **JDBC** connection to Azure MySQL
- **Port 8080** for API endpoints

## Security Best Practices

1. **Use Azure Key Vault** for sensitive credentials
2. **Enable HTTPS** (automatic with App Service)
3. **Configure MySQL firewall** to allow only App Service IPs
4. **Use managed identities** instead of passwords where possible
5. **Enable Application Insights** for monitoring

## Cost Optimization

- **B1 SKU**: ~$13/month per App Service
- **MySQL Burstable**: ~$12/month
- **Total estimated cost**: ~$38/month for complete setup

For production, consider:
- Scaling to higher SKUs (S1, P1V2)
- Using Azure Database for MySQL with backups
- Implementing CDN for static assets

