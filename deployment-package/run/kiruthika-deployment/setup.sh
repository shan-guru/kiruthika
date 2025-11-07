#!/usr/bin/env bash

# Kiruthika Application Setup Script
# This script checks for Docker and starts the application

set -e

echo "=========================================="
echo "Kiruthika Application Setup"
echo "=========================================="
echo ""

# Function to check if Docker is installed
check_docker() {
    if command -v docker &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to check if Docker is running
check_docker_running() {
    if docker info &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

# Check if Docker is installed
if ! check_docker; then
    echo "❌ Docker is not installed on your system."
    echo ""
    
    OS=$(detect_os)
    
    case $OS in
        "macos")
            echo "📦 To install Docker on macOS:"
            echo ""
            echo "Option 1: Download Docker Desktop (Recommended)"
            echo "  1. Visit: https://www.docker.com/products/docker-desktop"
            echo "  2. Download Docker Desktop for Mac"
            echo "  3. Install the .dmg file"
            echo "  4. Launch Docker Desktop from Applications"
            echo "  5. Wait for Docker to start (whale icon in menu bar)"
            echo "  6. Run this script again"
            echo ""
            echo "Option 2: Install via Homebrew"
            echo "  brew install --cask docker"
            echo "  Then launch Docker Desktop from Applications"
            ;;
        "windows")
            echo "📦 To install Docker on Windows:"
            echo ""
            echo "  1. Visit: https://www.docker.com/products/docker-desktop"
            echo "  2. Download Docker Desktop for Windows"
            echo "  3. Run the installer (Docker Desktop Installer.exe)"
            echo "  4. Follow the installation wizard"
            echo "  5. Restart your computer if prompted"
            echo "  6. Launch Docker Desktop from Start menu"
            echo "  7. Wait for Docker to start (whale icon in system tray)"
            echo "  8. Run this script again"
            echo ""
            echo "Note: Docker Desktop requires Windows 10 64-bit or Windows 11"
            echo "      with WSL 2 feature enabled."
            ;;
        "linux")
            echo "📦 To install Docker on Linux:"
            echo ""
            echo "  Run the following commands:"
            echo ""
            echo "  # Install Docker"
            echo "  curl -fsSL https://get.docker.com -o get-docker.sh"
            echo "  sudo sh get-docker.sh"
            echo ""
            echo "  # Add your user to docker group (optional, to run without sudo)"
            echo "  sudo usermod -aG docker \$USER"
            echo "  newgrp docker"
            echo ""
            echo "  # Start Docker service"
            echo "  sudo systemctl start docker"
            echo "  sudo systemctl enable docker"
            echo ""
            echo "  Then run this script again"
            ;;
        *)
            echo "📦 To install Docker:"
            echo "  Visit: https://www.docker.com/get-started"
            echo "  Follow the installation instructions for your operating system"
            ;;
    esac
    
    exit 1
fi

# Check if Docker is running
if ! check_docker_running; then
    echo "❌ Docker is installed but not running."
    echo ""
    OS=$(detect_os)
    
    case $OS in
        "macos")
            echo "Please start Docker Desktop:"
            echo "  1. Open Applications folder"
            echo "  2. Double-click Docker"
            echo "  3. Wait for Docker to start (whale icon in menu bar)"
            echo "  4. Run this script again"
            ;;
        "windows")
            echo "Please start Docker Desktop:"
            echo "  1. Click Start menu"
            echo "  2. Search for 'Docker Desktop'"
            echo "  3. Click Docker Desktop"
            echo "  4. Wait for Docker to start (whale icon in system tray)"
            echo "  5. Run this script again"
            ;;
        "linux")
            echo "Please start Docker service:"
            echo "  sudo systemctl start docker"
            echo "  Then run this script again"
            ;;
        *)
            echo "Please start Docker and run this script again"
            ;;
    esac
    
    exit 1
fi

echo "✅ Docker is installed and running"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available."
    echo "   Docker Compose should be included with Docker Desktop."
    echo "   Please update Docker Desktop to the latest version."
    exit 1
fi

# Use 'docker compose' (newer) or 'docker-compose' (older)
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

echo "✅ Docker Compose is available"
echo ""

# Check if compose file exists
if [ ! -f "docker-compose.remote.yml" ]; then
    echo "❌ Error: docker-compose.remote.yml not found"
    echo "   Make sure you're running this script from the deployment-package directory"
    exit 1
fi

echo "Starting application..."
echo ""

# Pull latest images
echo "📥 Pulling latest images from Docker Hub..."
$COMPOSE_CMD -f docker-compose.remote.yml pull

# Start services
echo ""
echo "🚀 Starting services..."
$COMPOSE_CMD -f docker-compose.remote.yml up -d

# Wait a moment for services to start
sleep 3

# Check status
echo ""
echo "📊 Application Status:"
$COMPOSE_CMD -f docker-compose.remote.yml ps

echo ""
echo "=========================================="
echo "✅ Application started successfully!"
echo "=========================================="
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080"
echo ""
echo "📝 Useful commands:"
echo "   View logs:    docker compose -f docker-compose.remote.yml logs -f"
echo "   Stop app:     ./shutdown.sh"
echo "   Check status: docker compose -f docker-compose.remote.yml ps"
echo ""
echo "⏳ Please wait 30-60 seconds for all services to fully initialize."
echo ""

