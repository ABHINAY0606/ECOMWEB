# Docker Build and Push Script (PowerShell)
# Builds and pushes both frontend and backend images to Docker Hub

# Configuration
$DOCKER_HUB_USER = "abhi0565"  # Update with your Docker Hub username
$VERSION = "v1"  # Update version as needed

$BACKEND_IMAGE = "$DOCKER_HUB_USER/order-backend:$VERSION"
$FRONTEND_IMAGE = "$DOCKER_HUB_USER/ecom-frontend:$VERSION"

Write-Host "========================================" -ForegroundColor Blue
Write-Host "Docker Build and Push" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

# Check if logged in to Docker Hub
Write-Host "`nChecking Docker Hub login..." -ForegroundColor Green
$dockerInfo = docker info 2>&1 | Out-String
if (-not ($dockerInfo -match "Username: $DOCKER_HUB_USER")) {
    Write-Host "Not logged in to Docker Hub. Please login:" -ForegroundColor Red
    docker login
}

# Build Backend
Write-Host "`nStep 1: Building Backend Image..." -ForegroundColor Green
Write-Host "Image: $BACKEND_IMAGE" -ForegroundColor Blue
docker build -t $BACKEND_IMAGE ./Order-Management

# Build Frontend
Write-Host "`nStep 2: Building Frontend Image..." -ForegroundColor Green
Write-Host "Image: $FRONTEND_IMAGE" -ForegroundColor Blue
docker build -t $FRONTEND_IMAGE ./ecommerceorder-frontend

# Push Backend
Write-Host "`nStep 3: Pushing Backend Image to Docker Hub..." -ForegroundColor Green
docker push $BACKEND_IMAGE

# Push Frontend
Write-Host "`nStep 4: Pushing Frontend Image to Docker Hub..." -ForegroundColor Green
docker push $FRONTEND_IMAGE

# Summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Build and Push Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nBackend Image: $BACKEND_IMAGE" -ForegroundColor Blue
Write-Host "Frontend Image: $FRONTEND_IMAGE" -ForegroundColor Blue
Write-Host "`nNext Steps:" -ForegroundColor Blue
Write-Host "1. Run .\deploy-app-service.ps1 to deploy to Azure"
Write-Host "2. Or update your deployment configuration with the new image tags"
