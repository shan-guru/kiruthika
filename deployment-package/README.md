# Kiruthika Application - Quick Start Guide

This package contains everything you need to run the Kiruthika application using pre-built Docker images.

## Prerequisites

- **Docker** installed and running
- **Docker Compose** (usually included with Docker Desktop)
- Internet connection to pull images from Docker Hub

## Quick Start

### 1. Extract this package

```bash
unzip kiruthika-deployment.zip
cd deployment-package
```

**Note**: After extraction, you'll have a `deployment-package` directory with all the necessary files.

### 2. Start the application

```bash
docker compose -f docker-compose.remote.yml up -d
```

This will:
- Pull the required Docker images from Docker Hub
- Start PostgreSQL database
- Start the Spring Boot backend API
- Start the React frontend

### 3. Access the application

- **Frontend (Web UI)**: http://localhost:3000
- **Backend API**: http://localhost:8080

Wait 30-60 seconds after starting for all services to initialize.

## Verify Installation

Check if all services are running:

```bash
docker compose -f docker-compose.remote.yml ps
```

You should see three services: `db`, `backend`, and `frontend`, all with status "Up".

## View Logs

```bash
# View all logs
docker compose -f docker-compose.remote.yml logs -f

# View specific service logs
docker compose -f docker-compose.remote.yml logs -f backend
docker compose -f docker-compose.remote.yml logs -f frontend
docker compose -f docker-compose.remote.yml logs -f db
```

## Stop the Application

```bash
docker compose -f docker-compose.remote.yml down
```

To also remove database data:

```bash
docker compose -f docker-compose.remote.yml down -v
```

## Troubleshooting

### Port Already in Use

If ports 3000 or 8080 are already in use, edit `docker-compose.remote.yml` and change the port mappings:

```yaml
backend:
  ports:
    - "8081:8080"  # Change 8080 to 8081

frontend:
  ports:
    - "3001:80"    # Change 3000 to 3001
```

### Images Not Found

If you get errors about images not found:

1. Verify you have internet connection
2. Check if images exist: `docker pull snadans/kiruthika-backend:latest`
3. If images are private, login first: `docker login`

### Database Connection Issues

If the backend can't connect to the database:

1. Wait a few seconds - database needs time to initialize
2. Check database logs: `docker compose -f docker-compose.remote.yml logs db`
3. Restart services: `docker compose -f docker-compose.remote.yml restart`

## Application Features

- **Supplier Credit Purchase**: Log purchases from suppliers
- **Supplier Settlement**: Record payments to suppliers
- **Customer Credit Purchase**: Log sales to customers
- **Customer Payment**: Record payments from customers
- **Reports**: Generate supplier and customer reports with filtering

## Support

For detailed documentation, see `DEPLOYMENT.md` in this package.

## System Requirements

- **Minimum**: 2GB RAM, 5GB disk space
- **Recommended**: 4GB RAM, 10GB disk space
- **OS**: Windows, macOS, or Linux with Docker support

