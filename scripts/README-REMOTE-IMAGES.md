# Building and Pushing Docker Images

This guide explains how to build and push Docker images to a registry for use with `docker-compose.remote.yml`.

## Prerequisites

1. Docker installed and running
2. Access to a container registry:
   - **GitHub Container Registry (ghcr.io)**: Requires GitHub Personal Access Token
   - **Docker Hub**: Requires Docker Hub account
   - **Other registry**: Configure as needed

## Quick Start

### For GitHub Container Registry (Recommended)

1. **Create a GitHub Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Create a token with `write:packages` permission
   - Copy the token

2. **Set the token as environment variable:**
   ```bash
   export GITHUB_TOKEN=your_github_token_here
   ```

3. **Build and push images:**
   ```bash
   ./scripts/build-and-push.sh ghcr.io shan-guru latest
   ```

### For Docker Hub

1. **Login to Docker Hub:**
   ```bash
   docker login
   ```

2. **Build and push images:**
   ```bash
   ./scripts/build-and-push.sh docker.io your-dockerhub-username latest
   ```

## Script Usage

```bash
./scripts/build-and-push.sh [registry] [username] [tag]
```

**Parameters:**
- `registry`: Container registry (default: `ghcr.io`)
  - `ghcr.io` - GitHub Container Registry
  - `docker.io` - Docker Hub
  - Or your custom registry URL
- `username`: Your registry username (default: `shan-guru`)
- `tag`: Image tag/version (default: `latest`)

**Examples:**

```bash
# GitHub Container Registry
./scripts/build-and-push.sh ghcr.io shan-guru latest

# Docker Hub
./scripts/build-and-push.sh docker.io myusername v1.0.0

# Custom registry
./scripts/build-and-push.sh registry.example.com myorg v1.0.0
```

## Using Remote Images

After pushing images, use the remote compose file:

```bash
docker compose -f docker-compose.remote.yml up -d
```

## Updating Image Names

If you use a different registry or username, update `docker-compose.remote.yml`:

```yaml
backend:
  image: your-registry/your-username/kiruthika-backend:latest

frontend:
  image: your-registry/your-username/kiruthika-frontend:latest
```

## Troubleshooting

### GitHub Container Registry Authentication
- Ensure `GITHUB_TOKEN` is set with `write:packages` permission
- Token must be valid and not expired

### Docker Hub Authentication
- Run `docker login` before pushing
- Ensure you have push permissions to the repository

### Image Not Found
- Verify image names in `docker-compose.remote.yml` match what you pushed
- Check image visibility (public/private) matches your access

