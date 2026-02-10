# Azure App Service Deployment Script (PowerShell)
# This script deploys the E-Commerce application to Azure App Service
# Frontend (Nginx + Angular) as main container with backend API proxying

# Configuration Variables
$RESOURCE_GROUP = "EcommerceRG"
$LOCATION = "eastus"
$APP_SERVICE_PLAN = "ecom-app-plan"
$BACKEND_APP_NAME = "order-backend-app"
$FRONTEND_APP_NAME = "ecom-frontend-app"
$MYSQL_SERVER_NAME = "ecom-mysql-server"
$MYSQL_DB_NAME = "ecom_db"
$MYSQL_ADMIN_USER = "ecomadmin"
$MYSQL_ADMIN_PASSWORD = "Bksra99@SecurePass"  # Change this!

# Docker Hub Configuration
$DOCKER_HUB_USER = "abhi0565"  # Update with your Docker Hub username
$BACKEND_IMAGE = "$DOCKER_HUB_USER/order-backend:v1"
$FRONTEND_IMAGE = "$DOCKER_HUB_USER/ecom-frontend:v1"

Write-Host "========================================" -ForegroundColor Blue
Write-Host "Azure App Service Deployment" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

# Step 1: Create Resource Group
Write-Host "`nStep 1: Creating Resource Group..." -ForegroundColor Green
az group create `
    --name $RESOURCE_GROUP `
    --location $LOCATION `
    --output table

# Step 2: Create App Service Plan (Linux, B1 SKU)
Write-Host "`nStep 2: Creating App Service Plan..." -ForegroundColor Green
az appservice plan create `
    --name $APP_SERVICE_PLAN `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --is-linux `
    --sku B1 `
    --output table

# Step 3: Create Azure Database for MySQL (Flexible Server)
Write-Host "`nStep 3: Creating Azure Database for MySQL..." -ForegroundColor Green
Write-Host "Note: This may take several minutes..." -ForegroundColor Blue

# Check if MySQL server already exists
$serverExists = az mysql flexible-server show --name $MYSQL_SERVER_NAME --resource-group $RESOURCE_GROUP 2>$null
if ($serverExists) {
    Write-Host "MySQL server already exists, skipping creation..." -ForegroundColor Blue
}
else {
    az mysql flexible-server create `
        --name $MYSQL_SERVER_NAME `
        --resource-group $RESOURCE_GROUP `
        --location $LOCATION `
        --admin-user $MYSQL_ADMIN_USER `
        --admin-password $MYSQL_ADMIN_PASSWORD `
        --sku-name Standard_B1ms `
        --tier Burstable `
        --version 8.0 `
        --storage-size 32 `
        --public-access 0.0.0.0-255.255.255.255 `
        --output table
}

# Create database
Write-Host "`nCreating database..." -ForegroundColor Green
az mysql flexible-server db create `
    --resource-group $RESOURCE_GROUP `
    --server-name $MYSQL_SERVER_NAME `
    --database-name $MYSQL_DB_NAME `
    --output table

# Get MySQL connection string
$MYSQL_HOST = "$MYSQL_SERVER_NAME.mysql.database.azure.com"
$MYSQL_CONNECTION_STRING = "jdbc:mysql://$MYSQL_HOST:3306/$MYSQL_DB_NAME?useSSL=true&requireSSL=false&serverTimezone=UTC"

Write-Host "MySQL Connection String: $MYSQL_CONNECTION_STRING" -ForegroundColor Blue

# Step 4: Deploy Backend App Service
Write-Host "`nStep 4: Deploying Backend App Service..." -ForegroundColor Green
az webapp create `
    --resource-group $RESOURCE_GROUP `
    --plan $APP_SERVICE_PLAN `
    --name $BACKEND_APP_NAME `
    --deployment-container-image-name $BACKEND_IMAGE `
    --output table

# Configure backend environment variables
Write-Host "`nConfiguring Backend Environment Variables..." -ForegroundColor Green
az webapp config appsettings set `
    --resource-group $RESOURCE_GROUP `
    --name $BACKEND_APP_NAME `
    --settings `
    SPRING_DATASOURCE_URL="$MYSQL_CONNECTION_STRING" `
    SPRING_DATASOURCE_USERNAME="$MYSQL_ADMIN_USER" `
    SPRING_DATASOURCE_PASSWORD="$MYSQL_ADMIN_PASSWORD" `
    SPRING_JPA_HIBERNATE_DDL_AUTO="update" `
    SPRING_JPA_SHOW_SQL="false" `
    SERVER_PORT="8080" `
    WEBSITES_PORT="8080" `
    --output table

# Get backend URL
$BACKEND_URL = "https://$BACKEND_APP_NAME.azurewebsites.net"
Write-Host "Backend URL: $BACKEND_URL" -ForegroundColor Blue

# Step 5: Deploy Frontend App Service
Write-Host "`nStep 5: Deploying Frontend App Service..." -ForegroundColor Green
az webapp create `
    --resource-group $RESOURCE_GROUP `
    --plan $APP_SERVICE_PLAN `
    --name $FRONTEND_APP_NAME `
    --deployment-container-image-name $FRONTEND_IMAGE `
    --output table

# Configure frontend environment variables
Write-Host "`nConfiguring Frontend Environment Variables..." -ForegroundColor Green
az webapp config appsettings set `
    --resource-group $RESOURCE_GROUP `
    --name $FRONTEND_APP_NAME `
    --settings `
    BACKEND_URL="$BACKEND_URL" `
    WEBSITES_PORT="80" `
    --output table

# Get frontend URL
$FRONTEND_URL = "https://$FRONTEND_APP_NAME.azurewebsites.net"

# Step 6: Configure container settings
Write-Host "`nStep 6: Configuring Container Settings..." -ForegroundColor Green

# Enable container logging for backend
az webapp log config `
    --resource-group $RESOURCE_GROUP `
    --name $BACKEND_APP_NAME `
    --docker-container-logging filesystem `
    --output table

# Enable container logging for frontend
az webapp log config `
    --resource-group $RESOURCE_GROUP `
    --name $FRONTEND_APP_NAME `
    --docker-container-logging filesystem `
    --output table

# Restart apps to apply settings
Write-Host "`nRestarting applications..." -ForegroundColor Green
az webapp restart --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME
az webapp restart --resource-group $RESOURCE_GROUP --name $FRONTEND_APP_NAME

# Summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nResource Group: $RESOURCE_GROUP" -ForegroundColor Blue
Write-Host "Backend URL: $BACKEND_URL" -ForegroundColor Blue
Write-Host "Frontend URL: $FRONTEND_URL" -ForegroundColor Blue
Write-Host "MySQL Server: $MYSQL_HOST" -ForegroundColor Blue
Write-Host "`nNext Steps:" -ForegroundColor Blue
Write-Host "1. Visit $FRONTEND_URL to access your application"
Write-Host "2. Check logs: az webapp log tail --resource-group $RESOURCE_GROUP --name $FRONTEND_APP_NAME"
Write-Host "3. Check backend logs: az webapp log tail --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME"
Write-Host "`nNote: It may take a few minutes for the containers to start and be accessible." -ForegroundColor Red
