@echo off
setlocal enabledelayedexpansion
title Realm Check - A Brighter You

color 06

echo.
echo  ========================================================================
echo    ____  _____    _    _     __  __    ____ _   _ _____ ____ _  __
echo   ^|  _ \^| ____^|  / \  ^| ^|   ^|  \/  ^|  / ___^| ^| ^| ^| ____/ ___^| ^|/ /
echo   ^| ^|_) ^|  _^|   / _ \ ^| ^|   ^| ^|\/^| ^| ^| ^|   ^| ^|_^| ^|  _^|^| ^|   ^| ' / 
echo   ^|  _ ^<^| ^|___ / ___ \^| ^|___^| ^|  ^| ^| ^| ^|___^|  _  ^| ^|__^| ^|___^| . \ 
echo   ^|_^| \_\_____/_/   \_\_____^|_^|  ^|_^|  \____^|_^| ^|_^|_____\____^|_^|\_\
echo.
echo                          A  B R I G H T E R  Y O U
echo  ========================================================================
echo.

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"
set "PID_DIR=%ROOT_DIR%.realmcheck"

if not exist "%PID_DIR%" (
    mkdir "%PID_DIR%" >nul 2>&1
)

echo [1/5] Checking Docker Desktop and PostgreSQL container...
where docker >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Docker executable not found in PATH.
    echo           Please ensure Docker Desktop is installed or local PostgreSQL is running.
) else (
    docker info >nul 2>&1
    if !ERRORLEVEL! neq 0 (
        echo [INFO] Docker Desktop is not running. Attempting to launch Docker Desktop...
        start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" >nul 2>&1
        echo Waiting up to 25 seconds for Docker daemon to become responsive...
        set /a DOCKER_WAIT=0
        :DOCKER_LOOP
        timeout /t 3 /nobreak >nul
        docker info >nul 2>&1
        if !ERRORLEVEL! equ 0 (
            echo [SUCCESS] Docker Desktop daemon is active.
            goto DOCKER_READY
        )
        set /a DOCKER_WAIT+=3
        if !DOCKER_WAIT! lss 25 goto DOCKER_LOOP
        echo [NOTE] Docker daemon did not start in time. Continuing with local PostgreSQL check...
    )
    :DOCKER_READY
    docker ps -a --filter "name=realmcheck-db" --format "{{.Status}}" | findstr /I "Up" >nul 2>&1
    if !ERRORLEVEL! equ 0 (
        echo [OK] PostgreSQL container 'realmcheck-db' is already running.
    ) else (
        docker inspect realmcheck-db >nul 2>&1
        if !ERRORLEVEL! equ 0 (
            echo Starting existing PostgreSQL container 'realmcheck-db'...
            docker start realmcheck-db >nul 2>&1
            echo [OK] PostgreSQL container 'realmcheck-db' started.
        ) else (
            echo [NOTE] PostgreSQL container 'realmcheck-db' not found. Checking docker-compose...
            if exist "%ROOT_DIR%docker-compose.yml" (
                docker compose up -d db >nul 2>&1
                echo [OK] Launched database service via docker compose.
            )
        )
    )
)

echo.
echo [2/5] Checking Spring Boot Backend (Port 8081)...
set "BACKEND_RUNNING=0"
for /f "tokens=5" %%a in ('netstat -ano ^| findstr /R /C:":8081 .*LISTENING"') do (
    set "BACKEND_RUNNING=1"
    set "EXISTING_BACKEND_PID=%%a"
)

if "!BACKEND_RUNNING!"=="1" (
    echo [OK] Backend service is already active on port 8081 (PID !EXISTING_BACKEND_PID!). Reusing existing service.
) else (
    echo Starting Spring Boot Backend on port 8081...
    start "Realm Check - Backend Service" /D "%BACKEND_DIR%" cmd.exe /k "title Realm Check - Backend ^& .\mvnw.cmd spring-boot:run"
    
    echo Waiting for Backend port 8081 to become ready...
    set /a B_ATTEMPTS=0
    :BACKEND_WAIT
    timeout /t 2 /nobreak >nul
    netstat -ano | findstr /R /C:":8081 .*LISTENING" >nul 2>&1
    if !ERRORLEVEL! equ 0 (
        for /f "tokens=5" %%p in ('netstat -ano ^| findstr /R /C:":8081 .*LISTENING"') do (
            set "STARTED_BACKEND_PID=%%p"
            echo !STARTED_BACKEND_PID! > "%PID_DIR%\backend.pid"
        )
        echo [SUCCESS] Spring Boot Backend is healthy and listening on port 8081.
        goto BACKEND_READY
    )
    set /a B_ATTEMPTS+=1
    if !B_ATTEMPTS! lss 40 goto BACKEND_WAIT
    echo [WARNING] Backend startup is taking longer than usual. Please check the 'Realm Check - Backend' console window.
)
:BACKEND_READY

echo.
echo [3/5] Checking React Frontend (Port 5173)...
set "FRONTEND_RUNNING=0"
for /f "tokens=5" %%a in ('netstat -ano ^| findstr /R /C:":5173 .*LISTENING"') do (
    set "FRONTEND_RUNNING=1"
    set "EXISTING_FRONTEND_PID=%%a"
)

if "!FRONTEND_RUNNING!"=="1" (
    echo [OK] Frontend service is already active on port 5173 (PID !EXISTING_FRONTEND_PID!). Reusing existing service.
) else (
    echo Starting Vite Dev Server on port 5173...
    start "Realm Check - Frontend Service" /D "%FRONTEND_DIR%" cmd.exe /k "title Realm Check - Frontend ^& npm run dev -- --port 5173"
    
    echo Waiting for Frontend port 5173 to become ready...
    set /a F_ATTEMPTS=0
    :FRONTEND_WAIT
    timeout /t 2 /nobreak >nul
    netstat -ano | findstr /R /C:":5173 .*LISTENING" >nul 2>&1
    if !ERRORLEVEL! equ 0 (
        for /f "tokens=5" %%p in ('netstat -ano ^| findstr /R /C:":5173 .*LISTENING"') do (
            set "STARTED_FRONTEND_PID=%%p"
            echo !STARTED_FRONTEND_PID! > "%PID_DIR%\frontend.pid"
        )
        echo [SUCCESS] Frontend is ready on http://localhost:5173.
        goto FRONTEND_READY
    )
    set /a F_ATTEMPTS+=1
    if !F_ATTEMPTS! lss 25 goto FRONTEND_WAIT
    echo [WARNING] Frontend startup is taking longer than usual. Please check the 'Realm Check - Frontend' console window.
)
:FRONTEND_READY

echo.
echo [4/5] Launching Realm Check in your default browser...
start http://localhost:5173/realm

echo.
echo [5/5] Application status:
echo  ========================================================================
echo   Realm Dashboard  : http://localhost:5173/realm
echo   Backend API      : http://localhost:8081
echo   Database         : PostgreSQL Container (realmcheck-db) / Port 5432-5433
echo  ========================================================================
echo.
echo  Keep this launcher window open, or run 'Stop Realm Check.bat' to safely stop.
echo.
pause
