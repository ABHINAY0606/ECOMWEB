#!/bin/bash

# Docker Build and Push Script
# Builds and pushes both frontend and backend images to Docker Hub

set -e  # Exit on error

# Configuration
DOCKER_HUB_USER="abhi0565"  # Update with your Docker Hub username
VERSION="v1"  # Update version as needed

BACKEND_IMAGE="${DOCKER_HUB_USER}/order-backend:${VERSION}"
FRONTEND_IMAGE="${DOCKER_HUB_USER}/ecom-frontend:${VERSION}"

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Docker Build and Push${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if logged in to Docker Hub
echo -e "\n${GREEN}Checking Docker Hub login...${NC}"
if ! docker info | grep -q "Username: ${DOCKER_HUB_USER}"; then
  echo -e "${RED}Not logged in to Docker Hub. Please login:${NC}"
  docker login
fi

# Build Backend
echo -e "\n${GREEN}Step 1: Building Backend Image...${NC}"
echo -e "${BLUE}Image: ${BACKEND_IMAGE}${NC}"
docker build -t $BACKEND_IMAGE ./Order-Management

# Build Frontend
echo -e "\n${GREEN}Step 2: Building Frontend Image...${NC}"
echo -e "${BLUE}Image: ${FRONTEND_IMAGE}${NC}"
docker build -t $FRONTEND_IMAGE ./ecommerceorder-frontend

# Push Backend
echo -e "\n${GREEN}Step 3: Pushing Backend Image to Docker Hub...${NC}"
docker push $BACKEND_IMAGE

# Push Frontend
echo -e "\n${GREEN}Step 4: Pushing Frontend Image to Docker Hub...${NC}"
docker push $FRONTEND_IMAGE

# Summary
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Build and Push Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${BLUE}Backend Image:${NC} $BACKEND_IMAGE"
echo -e "${BLUE}Frontend Image:${NC} $FRONTEND_IMAGE"
echo -e "\n${BLUE}Next Steps:${NC}"
echo -e "1. Run ./deploy-app-service.sh to deploy to Azure"
echo -e "2. Or update your deployment configuration with the new image tags"
