# Quick Deployment Guide

## Prerequisites
- Azure CLI: `az login`
- Docker installed and running
- Docker Hub account

## Step 1: Update Configuration

Edit the following files with your Docker Hub username:
- `build-and-push.sh` or `build-and-push.ps1`
- `deploy-app-service.sh` or `deploy-app-service.ps1`

Change `DOCKER_HUB_USER="abhi0565"` to your username.

## Step 2: Build and Push Images

**Windows (PowerShell)**:
```powershell
.\build-and-push.ps1
```

**Linux/Mac/WSL (Bash)**:
```bash
chmod +x build-and-push.sh
./build-and-push.sh
```

## Step 3: Deploy to Azure

**Windows (PowerShell)**:
```powershell
.\deploy-app-service.ps1
```

**Linux/Mac/WSL (Bash)**:
```bash
chmod +x deploy-app-service.sh
./deploy-app-service.sh
```

## Step 4: Access Your Application

After deployment (wait 3-5 minutes for containers to start):
- **Frontend**: https://ecom-frontend-app.azurewebsites.net
- **Backend**: https://order-backend-app.azurewebsites.net

## Troubleshooting

**View Logs**:
```bash
az webapp log tail --resource-group EcommerceRG --name ecom-frontend-app
az webapp log tail --resource-group EcommerceRG --name order-backend-app
```

**Common Issues**:
- Container not starting → Check logs for errors
- API calls failing → Verify BACKEND_URL environment variable
- Database errors → Check MySQL connection string and firewall rules

## Cost
Estimated monthly cost: ~$38 (B1 App Service Plan + MySQL Flexible Server)

For detailed information, see [DEPLOY.md](file:///c:/ECOMMERCE/DEPLOY.md)
