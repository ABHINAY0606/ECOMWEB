# E-Commerce Order Management System

A full-stack e-commerce application designed to manage orders, products, and customers. Built with a modern tech stack featuring Angular for the frontend and Spring Boot for the backend, deployed on Azure using Docker containers.

## 🚀 Features

- **Storefront**: Browse products, manage cart, and place orders.
- **Order Management**: Admin dashboard to view and manage customer orders.
- **RESTful API**: Robust backend API for data management.
- **Database Integration**: MySQL database for persistent storage.
- **Containerized**: Docker support for consistent environments.
- **Cloud Ready**: Deployment scripts for Azure App Service.

## 🛠️ Tech Stack

- **Frontend**: Angular 21, TypeScript, Bootstrap/Custom CSS
- **Backend**: Java 21, Spring Boot 3.x, Hibernate/JPA
- **Database**: MySQL 8.0
- **DevOps**: Docker, Azure App Service, GitHub Actions (CI/CD)

## 📋 Prerequisites

Ensure you have the following installed:

- [Java JDK 21+](https://adoptium.net/)
- [Node.js 20+ (LTS)](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (or run via Docker)

## ⚙️ Local Development Setup

### 1. Database Setup
Create a MySQL database named `ecom_db`. Provide your credentials in `src/main/resources/application.properties` or environment variables.

### 2. Backend (Spring Boot)
Navigate to the backend directory:
```bash
cd Order-Management
```

Build the project:
```bash
./mvnw clean install
```
*(Windows: `.\mvnw.cmd clean install`)*

Run the application:
```bash
./mvnw spring-boot:run
```
The backend API will run on `http://localhost:8080`.

### 3. Frontend (Angular)
Navigate to the frontend directory:
```bash
cd ecommerceorder-frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm start
```
Navigate to `http://localhost:4200/`.

## 🐳 Docker Setup

To run the entire stack using Docker Compose:

1. Update `docker-compose.yml` if necessary (e.g., database credentials).
2. Run:
   ```bash
   docker-compose up --build
   ```

The application will be available at:
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:8080`

> **Note:** The current `docker-compose.yml` expects a MySQL instance running on the host machine accessible via `host.docker.internal`. Ensure your local MySQL server allows connections and the user `root` with password `Bksra99@` exists (as defined in `docker-compose.yml`), or update the file with your credentials.

## ☁️ Deployment to Azure

See [DEPLOY.md](DEPLOY.md) and [QUICKSTART.md](QUICKSTART.md) for detailed deployment instructions using the provided scripts:

- **Build & Push**: `./build-and-push.ps1` (Windows) or `./build-and-push.sh` (Linux/Mac)
- **Deploy**: `./deploy-app-service.ps1` (Windows) or `./deploy-app-service.sh` (Linux/Mac)

## 📂 Project Structure

```
c:\ECOMMERCE
├── Order-Management/        # Spring Boot Backend
├── ecommerceorder-frontend/ # Angular Frontend
├── docker-compose.yml       # Docker orchestration
├── DEPLOY.md                # Deployment guide
├── QUICKSTART.md            # Quick start guide
└── ...
```
