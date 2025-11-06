#!/usr/bin/env bash
# Script to build and push Docker images to a registry
# Usage: ./scripts/build-and-push.sh [registry] [username] [tag]
# Example: ./scripts/build-and-push.sh ghcr.io shan-guru latest

set -e

# Default values
REGISTRY=${1:-"docker.io"}  # Options: docker.io (Docker Hub), ghcr.io (GitHub), or your-registry.com
USERNAME=${2:-"snadans"}  # Your Docker Hub username or GitHub username
TAG=${3:-"latest"}

# Image names - Docker Hub uses format: username/repository:tag (docker.io is implicit)
if [ "${REGISTRY}" = "docker.io" ]; then
    BACKEND_IMAGE="${USERNAME}/kiruthika-backend:${TAG}"
    FRONTEND_IMAGE="${USERNAME}/kiruthika-frontend:${TAG}"
else
    BACKEND_IMAGE="${REGISTRY}/${USERNAME}/kiruthika-backend:${TAG}"
    FRONTEND_IMAGE="${REGISTRY}/${USERNAME}/kiruthika-frontend:${TAG}"
fi

echo "=========================================="
echo "Building and Pushing Docker Images"
echo "=========================================="
echo "Registry: ${REGISTRY}"
echo "Username: ${USERNAME}"
echo "Tag: ${TAG}"
echo "Backend Image: ${BACKEND_IMAGE}"
echo "Frontend Image: ${FRONTEND_IMAGE}"
echo "=========================================="
echo ""

# Login to registry if needed
if [ "${REGISTRY}" = "ghcr.io" ]; then
    echo "Logging in to GitHub Container Registry..."
    if [ -z "${GITHUB_TOKEN}" ]; then
        echo "Error: GITHUB_TOKEN environment variable not set"
        echo "Create a token at: https://github.com/settings/tokens"
        echo "Required permissions: write:packages, delete:packages"
        echo "Then run: export GITHUB_TOKEN=your_token"
        exit 1
    fi
    
    # Test token validity first
    echo "Verifying GitHub token..."
    TOKEN_VALID=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/user | grep -q '"login"' && echo "valid" || echo "invalid")
    if [ "${TOKEN_VALID}" != "valid" ]; then
        echo "Error: GitHub token is invalid or expired"
        echo "Please create a new token at: https://github.com/settings/tokens"
        exit 1
    fi
    # For GitHub Container Registry, use the token as password and username as the GitHub username
    echo "${GITHUB_TOKEN}" | docker login ghcr.io -u "${USERNAME}" --password-stdin
    if [ $? -ne 0 ]; then
        echo "Error: Failed to login to GitHub Container Registry"
        echo "Check that:"
        echo "  1. GITHUB_TOKEN is valid and not expired"
        echo "  2. Token has 'write:packages' permission"
        echo "  3. Username '${USERNAME}' matches your GitHub username"
        echo "  4. Token has not been revoked"
        exit 1
    fi
    echo "✅ Successfully logged in to GitHub Container Registry"
elif [ "${REGISTRY}" = "docker.io" ]; then
    echo "Logging in to Docker Hub..."
    
    # Check if already logged in
    if docker info 2>/dev/null | grep -q "Username:"; then
        echo "Already logged in to Docker Hub"
    else
        # Try using access token if available (more reliable than password)
        if [ -n "${DOCKER_HUB_TOKEN}" ]; then
            echo "Using Docker Hub access token..."
            echo "${DOCKER_HUB_TOKEN}" | docker login -u "${USERNAME}" --password-stdin
        elif [ -n "${DOCKER_HUB_PASSWORD}" ]; then
            echo "Using Docker Hub password from environment..."
            echo "${DOCKER_HUB_PASSWORD}" | docker login -u "${USERNAME}" --password-stdin
        else
            echo "Enter your Docker Hub credentials:"
            echo "Tip: For better reliability, use an access token instead of password"
            echo "Create one at: https://hub.docker.com/settings/security"
            docker login
        fi
        
        if [ $? -ne 0 ]; then
            echo ""
            echo "Error: Failed to login to Docker Hub"
            echo "Troubleshooting:"
            echo "  1. Check your internet connection"
            echo "  2. Try using an access token instead of password:"
            echo "     export DOCKER_HUB_TOKEN=your_token"
            echo "     ./scripts/build-and-push.sh docker.io ${USERNAME} latest"
            echo "  3. Create access token at: https://hub.docker.com/settings/security"
            echo "  4. Make sure you have a Docker Hub account at: https://hub.docker.com"
            exit 1
        fi
    fi
    echo "✅ Successfully logged in to Docker Hub"
else
    echo "Logging in to ${REGISTRY}..."
    docker login "${REGISTRY}"
fi

# Build backend image
echo ""
echo "Building backend image..."
cd "$(dirname "$0")/../backend"
docker build -t "${BACKEND_IMAGE}" .

# Build frontend image
echo ""
echo "Building frontend image..."
cd "../frontend"
docker build -t "${FRONTEND_IMAGE}" .

# Push images
echo ""
echo "Pushing backend image..."
echo "Note: If repository doesn't exist, Docker Hub will create it on first push"
docker push "${BACKEND_IMAGE}"
if [ $? -ne 0 ]; then
    echo ""
    echo "Error: Failed to push backend image"
    echo "Possible reasons:"
    echo "  1. Repository doesn't exist - Create it at: https://hub.docker.com/repositories"
    echo "  2. Repository name must match: ${USERNAME}/kiruthika-backend"
    echo "  3. Check your Docker Hub username matches: ${USERNAME}"
    echo "  4. Ensure you're logged in: docker login"
    exit 1
fi

echo ""
echo "Pushing frontend image..."
docker push "${FRONTEND_IMAGE}"
if [ $? -ne 0 ]; then
    echo ""
    echo "Error: Failed to push frontend image"
    echo "Possible reasons:"
    echo "  1. Repository doesn't exist - Create it at: https://hub.docker.com/repositories"
    echo "  2. Repository name must match: ${USERNAME}/kiruthika-frontend"
    echo "  3. Check your Docker Hub username matches: ${USERNAME}"
    echo "  4. Ensure you're logged in: docker login"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Successfully pushed images:"
echo "   ${BACKEND_IMAGE}"
echo "   ${FRONTEND_IMAGE}"
echo "=========================================="
echo ""
echo "Update docker-compose.remote.yml with these image names"

