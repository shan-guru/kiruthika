#!/usr/bin/env bash

# Kiruthika Application Shutdown Script
# This script stops and removes the application containers

set -e

echo "=========================================="
echo "Kiruthika Application Shutdown"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running."
    echo "   The application is likely not running."
    exit 0
fi

# Use 'docker compose' (newer) or 'docker-compose' (older)
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# Check if compose file exists
if [ ! -f "docker-compose.remote.yml" ]; then
    echo "❌ Error: docker-compose.remote.yml not found"
    echo "   Make sure you're running this script from the deployment-package directory"
    exit 1
fi

# Check if containers are running
if [ -z "$($COMPOSE_CMD -f docker-compose.remote.yml ps -q)" ]; then
    echo "ℹ️  No containers are currently running."
    exit 0
fi

echo "🛑 Stopping application..."
echo ""

# Stop and remove containers
$COMPOSE_CMD -f docker-compose.remote.yml down

echo ""
echo "=========================================="
echo "✅ Application stopped successfully!"
echo "=========================================="
echo ""
echo "ℹ️  Note: Database data is preserved in Docker volumes."
echo "   To remove all data, run:"
echo "   docker compose -f docker-compose.remote.yml down -v"
echo ""

