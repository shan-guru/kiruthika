@echo off
REM Kiruthika Application Shutdown Script for Windows
REM This script stops and removes the application containers

echo ==========================================
echo Kiruthika Application Shutdown
echo ==========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Docker is not running.
    echo    The application is likely not running.
    pause
    exit /b 0
)

REM Check if docker-compose is available
docker compose version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    docker-compose version >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Docker Compose is not available.
        pause
        exit /b 1
    )
    set COMPOSE_CMD=docker-compose
) else (
    set COMPOSE_CMD=docker compose
)

REM Check if compose file exists
if not exist "docker-compose.remote.yml" (
    echo [ERROR] docker-compose.remote.yml not found
    echo    Make sure you're running this script from the deployment-package directory
    pause
    exit /b 1
)

REM Check if containers are running
%COMPOSE_CMD% -f docker-compose.remote.yml ps -q >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] No containers are currently running.
    pause
    exit /b 0
)

echo [INFO] Stopping application...
echo.

REM Stop and remove containers
%COMPOSE_CMD% -f docker-compose.remote.yml down

echo.
echo ==========================================
echo [OK] Application stopped successfully!
echo ==========================================
echo.
echo [INFO] Note: Database data is preserved in Docker volumes.
echo    To remove all data, run:
echo    docker compose -f docker-compose.remote.yml down -v
echo.
pause

