@echo off
REM Kiruthika Application Setup Script for Windows
REM This script checks for Docker and starts the application

echo ==========================================
echo Kiruthika Application Setup
echo ==========================================
echo.

REM Check if Docker is installed
where docker >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not installed on your system.
    echo.
    echo To install Docker on Windows:
    echo   1. Visit: https://www.docker.com/products/docker-desktop
    echo   2. Download Docker Desktop for Windows
    echo   3. Run the installer (Docker Desktop Installer.exe)
    echo   4. Follow the installation wizard
    echo   5. Restart your computer if prompted
    echo   6. Launch Docker Desktop from Start menu
    echo   7. Wait for Docker to start (whale icon in system tray)
    echo   8. Run this script again
    echo.
    echo Note: Docker Desktop requires Windows 10 64-bit or Windows 11
    echo       with WSL 2 feature enabled.
    echo.
    pause
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is installed but not running.
    echo.
    echo Please start Docker Desktop:
    echo   1. Click Start menu
    echo   2. Search for 'Docker Desktop'
    echo   3. Click Docker Desktop
    echo   4. Wait for Docker to start (whale icon in system tray)
    echo   5. Run this script again
    echo.
    pause
    exit /b 1
)

echo [OK] Docker is installed and running
echo.

REM Check if docker-compose is available
docker compose version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    docker-compose version >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Docker Compose is not available.
        echo    Docker Compose should be included with Docker Desktop.
        echo    Please update Docker Desktop to the latest version.
        pause
        exit /b 1
    )
    set COMPOSE_CMD=docker-compose
) else (
    set COMPOSE_CMD=docker compose
)

echo [OK] Docker Compose is available
echo.

REM Check if compose file exists
if not exist "docker-compose.remote.yml" (
    echo [ERROR] docker-compose.remote.yml not found
    echo    Make sure you're running this script from the deployment-package directory
    pause
    exit /b 1
)

echo Starting application...
echo.

REM Pull latest images
echo [INFO] Pulling latest images from Docker Hub...
%COMPOSE_CMD% -f docker-compose.remote.yml pull

REM Start services
echo.
echo [INFO] Starting services...
%COMPOSE_CMD% -f docker-compose.remote.yml up -d

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Check status
echo.
echo [INFO] Application Status:
%COMPOSE_CMD% -f docker-compose.remote.yml ps

echo.
echo ==========================================
echo [OK] Application started successfully!
echo ==========================================
echo.
echo Access the application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8080
echo.
echo Useful commands:
echo    View logs:    docker compose -f docker-compose.remote.yml logs -f
echo    Stop app:     shutdown.bat
echo    Check status: docker compose -f docker-compose.remote.yml ps
echo.
echo Please wait 30-60 seconds for all services to fully initialize.
echo.
pause

