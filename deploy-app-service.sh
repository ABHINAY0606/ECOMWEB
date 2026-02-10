#!/bin/bash

# Azure App Service Deployment Script
# This script deploys the E-Commerce application to Azure App Service
# Frontend (Nginx + Angular) as main container with backend API proxying

set -e  # Exit on error

# Configuration Variables
RESOURCE_GROUP="EcommerceRG"
LOCATION="eastus"
APP_SERVICE_PLAN="ecom-app-plan"
BACKEND_APP_NAME="order-backend-app"
FRONTEND_APP_NAME="ecom-frontend-app"
MYSQL_SERVER_NAME="ecom-mysql-server"
MYSQL_DB_NAME="ecom_db"
MYSQL_ADMIN_USER="ecomadmin"
MYSQL_ADMIN_PASSWORD="Bksra99@SecurePass"  # Change this!

# Docker Hub Configuration
DOCKER_HUB_USER="abhi0565"  # Update with your Docker Hub username
BACKEND_IMAGE="${DOCKER_HUB_USER}/order-backend:v1"
FRONTEND_IMAGE="${DOCKER_HUB_USER}/ecom-frontend:v1"

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Azure App Service Deployment${NC}"
echo -e "${BLUE}========================================${NC}"

# Step 1: Create Resource Group
echo -e "\n${GREEN}Step 1: Creating Resource Group...${NC}"
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION \
  --output table

# Step 2: Create App Service Plan (Linux, B1 SKU)
echo -e "\n${GREEN}Step 2: Creating App Service Plan...${NC}"
az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --is-linux \
  --sku B1 \
  --output table

# Step 3: Create Azure Database for MySQL (Flexible Server)
echo -e "\n${GREEN}Step 3: Creating Azure Database for MySQL...${NC}"
echo -e "${BLUE}Note: This may take several minutes...${NC}"

# Check if MySQL server already exists
if az mysql flexible-server show --name $MYSQL_SERVER_NAME --resource-group $RESOURCE_GROUP &>/dev/null; then
  echo -e "${BLUE}MySQL server already exists, skipping creation...${NC}"
else
  az mysql flexible-server create \
    --name $MYSQL_SERVER_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --admin-user $MYSQL_ADMIN_USER \
    --admin-password $MYSQL_ADMIN_PASSWORD \
    --sku-name Standard_B1ms \
    --tier Burstable \
    --version 8.0 \
    --storage-size 32 \
    --public-access 0.0.0.0-255.255.255.255 \
    --output table
fi

# Create database
echo -e "\n${GREEN}Creating database...${NC}"
az mysql flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $MYSQL_SERVER_NAME \
  --database-name $MYSQL_DB_NAME \
  --output table || echo "Database may already exist"

# Get MySQL connection string
MYSQL_HOST="${MYSQL_SERVER_NAME}.mysql.database.azure.com"
MYSQL_CONNECTION_STRING="jdbc:mysql://${MYSQL_HOST}:3306/${MYSQL_DB_NAME}?useSSL=true&requireSSL=false&serverTimezone=UTC"

echo -e "${BLUE}MySQL Connection String: ${MYSQL_CONNECTION_STRING}${NC}"

# Step 4: Deploy Backend App Service
echo -e "\n${GREEN}Step 4: Deploying Backend App Service...${NC}"
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $BACKEND_APP_NAME \
  --deployment-container-image-name $BACKEND_IMAGE \
  --output table

# Configure backend environment variables
echo -e "\n${GREEN}Configuring Backend Environment Variables...${NC}"
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --settings \
    SPRING_DATASOURCE_URL="$MYSQL_CONNECTION_STRING" \
    SPRING_DATASOURCE_USERNAME="$MYSQL_ADMIN_USER" \
    SPRING_DATASOURCE_PASSWORD="$MYSQL_ADMIN_PASSWORD" \
    SPRING_JPA_HIBERNATE_DDL_AUTO="update" \
    SPRING_JPA_SHOW_SQL="false" \
    SERVER_PORT="8080" \
    WEBSITES_PORT="8080" \
  --output table

# Get backend URL
BACKEND_URL="https://${BACKEND_APP_NAME}.azurewebsites.net"
echo -e "${BLUE}Backend URL: ${BACKEND_URL}${NC}"

# Step 5: Deploy Frontend App Service
echo -e "\n${GREEN}Step 5: Deploying Frontend App Service...${NC}"
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $FRONTEND_APP_NAME \
  --deployment-container-image-name $FRONTEND_IMAGE \
  --output table

# Configure frontend environment variables
echo -e "\n${GREEN}Configuring Frontend Environment Variables...${NC}"
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $FRONTEND_APP_NAME \
  --settings \
    BACKEND_URL="$BACKEND_URL" \
    WEBSITES_PORT="80" \
  --output table

# Get frontend URL
FRONTEND_URL="https://${FRONTEND_APP_NAME}.azurewebsites.net"

# Step 6: Configure container settings
echo -e "\n${GREEN}Step 6: Configuring Container Settings...${NC}"

# Enable container logging for backend
az webapp log config \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --docker-container-logging filesystem \
  --output table

# Enable container logging for frontend
az webapp log config \
  --resource-group $RESOURCE_GROUP \
  --name $FRONTEND_APP_NAME \
  --docker-container-logging filesystem \
  --output table

# Restart apps to apply settings
echo -e "\n${GREEN}Restarting applications...${NC}"
az webapp restart --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME
az webapp restart --resource-group $RESOURCE_GROUP --name $FRONTEND_APP_NAME

# Summary
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${BLUE}Resource Group:${NC} $RESOURCE_GROUP"
echo -e "${BLUE}Backend URL:${NC} $BACKEND_URL"
echo -e "${BLUE}Frontend URL:${NC} $FRONTEND_URL"
echo -e "${BLUE}MySQL Server:${NC} $MYSQL_HOST"
echo -e "\n${BLUE}Next Steps:${NC}"
echo -e "1. Visit ${FRONTEND_URL} to access your application"
echo -e "2. Check logs: az webapp log tail --resource-group $RESOURCE_GROUP --name $FRONTEND_APP_NAME"
echo -e "3. Check backend logs: az webapp log tail --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME"
echo -e "\n${RED}Note:${NC} It may take a few minutes for the containers to start and be accessible."
