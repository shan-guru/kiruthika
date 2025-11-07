# Running the Application Anywhere with Remote Images

This guide explains how to deploy and run the Kiruthika application on any machine using pre-built Docker images from Docker Hub.

## Overview

The application uses Docker Compose to orchestrate three services:
- **Database**: PostgreSQL 13
- **Backend**: Spring Boot API (port 8080)
- **Frontend**: React web app (port 3000)

## Prerequisites

- **Docker** installed and running
- **Docker Compose** (usually included with Docker Desktop)
- Internet connection to pull images from Docker Hub

## Step 1: Build and Push Images (First Time Only)

This step is done **once** from your development machine to publish images to Docker Hub.

### 1.1 Create Docker Hub Repositories

1. Go to https://hub.docker.com/repositories
2. Click "Create Repository"
3. Create two repositories:
   - `kiruthika-backend` (Public or Private)
   - `kiruthika-frontend` (Public or Private)
4. Make sure the owner is your Docker Hub username (e.g., `snadans`)

### 1.2 Login to Docker Hub

```bash
docker login
# Enter your Docker Hub username and password/token
```

**Tip**: For better reliability, use an access token instead of password:
1. Create token at: https://hub.docker.com/settings/security
2. Use it: `echo "your_token" | docker login -u snadans --password-stdin`

### 1.3 Build and Push Images

From the project root directory:

```bash
# Make script executable (if not already)
chmod +x scripts/build-and-push.sh

# Build and push to Docker Hub
./scripts/build-and-push.sh docker.io snadans latest
```

This will:
- Build the backend image
- Build the frontend image
- Tag them as `snadans/kiruthika-backend:latest` and `snadans/kiruthika-frontend:latest`
- Push them to Docker Hub

**Note**: Replace `snadans` with your actual Docker Hub username if different.

## Step 2: Run the Application Anywhere

Once images are pushed, you can run the application on **any machine** with Docker installed.

### 2.1 Clone the Repository (or download docker-compose.remote.yml)

**Option A: Clone the full repository**
```bash
git clone https://github.com/shan-guru/kiruthika.git
cd kiruthika
```

**Option B: Just download the compose file**
```bash
# Download only the remote compose file
curl -O https://raw.githubusercontent.com/shan-guru/kiruthika/upgrade/java-21/docker-compose.remote.yml
```

### 2.2 Update Image Names (if needed)

If you used a different username or registry, edit `docker-compose.remote.yml`:

```yaml
backend:
  image: your-username/kiruthika-backend:latest

frontend:
  image: your-username/kiruthika-frontend:latest
```

### 2.3 Start the Application

```bash
# Start all services
docker compose -f docker-compose.remote.yml up -d

# View logs
docker compose -f docker-compose.remote.yml logs -f

# Check status
docker compose -f docker-compose.remote.yml ps
```

### 2.4 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5433 (if you need direct access)

### 2.5 Stop the Application

```bash
docker compose -f docker-compose.remote.yml down

# To also remove volumes (deletes database data)
docker compose -f docker-compose.remote.yml down -v
```

## Quick Reference

### Common Commands

```bash
# Start application
docker compose -f docker-compose.remote.yml up -d

# Stop application
docker compose -f docker-compose.remote.yml down

# View logs
docker compose -f docker-compose.remote.yml logs -f

# Restart a service
docker compose -f docker-compose.remote.yml restart backend

# Update to latest images
docker compose -f docker-compose.remote.yml pull
docker compose -f docker-compose.remote.yml up -d
```

### Updating the Application

When you push new images to Docker Hub:

```bash
# Pull latest images
docker compose -f docker-compose.remote.yml pull

# Restart services with new images
docker compose -f docker-compose.remote.yml up -d
```

## Troubleshooting

### Images Not Found

**Error**: `pull access denied` or `repository does not exist`

**Solution**:
1. Verify repositories exist on Docker Hub: https://hub.docker.com/repositories
2. Check image names in `docker-compose.remote.yml` match your Docker Hub repositories
3. Ensure repositories are public, or you're logged in: `docker login`

### Port Already in Use

**Error**: `Bind for 0.0.0.0:8080 failed: port is already allocated`

**Solution**: Change ports in `docker-compose.remote.yml`:
```yaml
backend:
  ports:
    - "8081:8080"  # Use 8081 instead of 8080

frontend:
  ports:
    - "3001:80"    # Use 3001 instead of 3000
```

### Database Connection Issues

**Error**: Backend can't connect to database

**Solution**: 
1. Ensure database service is running: `docker compose -f docker-compose.remote.yml ps`
2. Check database logs: `docker compose -f docker-compose.remote.yml logs db`
3. Wait a few seconds after starting - database needs time to initialize

### Network Issues

**Error**: Can't pull images

**Solution**:
1. Check internet connection
2. Try: `docker pull snadans/kiruthika-backend:latest` manually
3. If behind a proxy, configure Docker proxy settings

## Deployment Scenarios

### Local Development Machine
```bash
docker compose -f docker-compose.remote.yml up -d
```

### Remote Server (Linux)
1. SSH into the server
2. Install Docker: `curl -fsSL https://get.docker.com | sh`
3. Clone repository or download `docker-compose.remote.yml`
4. Run: `docker compose -f docker-compose.remote.yml up -d`

### Cloud Platform (AWS, Azure, GCP)
1. Create a VM instance
2. Install Docker on the VM
3. Follow "Remote Server" steps above
4. Configure security groups/firewalls to allow ports 3000 and 8080

### CI/CD Pipeline
Add to your pipeline:
```yaml
- name: Deploy
  run: |
    docker compose -f docker-compose.remote.yml pull
    docker compose -f docker-compose.remote.yml up -d
```

## Security Notes

- **Production**: Change default database password in `docker-compose.remote.yml`
- **Public Images**: If repositories are public, anyone can pull and use your images
- **Private Images**: For private repositories, ensure `docker login` is done before pulling
- **Environment Variables**: Consider using Docker secrets or environment files for sensitive data

## Next Steps

- Set up automated builds on Docker Hub (builds on git push)
- Configure health checks and monitoring
- Set up backup strategy for database volumes
- Use Docker Swarm or Kubernetes for production scaling

