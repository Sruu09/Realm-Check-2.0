@echo off
setlocal enabledelayedexpansion
title Stop Realm Check

color 0c

echo.
echo  ========================================================================
echo               REALM CHECK 2.0 - SHUTDOWN UTILITY
echo  ========================================================================
echo.

set "ROOT_DIR=%~dp0"
set "PID_DIR=%ROOT_DIR%.realmcheck"

echo [1/3] Terminating services started by Realm Check launcher...

set "STOPPED_COUNT=0"

rem 1. Check frontend PID file
if exist "%PID_DIR%\frontend.pid" (
    set /p F_PID=<"%PID_DIR%\frontend.pid"
    set "F_PID=!F_PID: =!"
    if not "!F_PID!"=="" (
        tasklist /FI "PID eq !F_PID!" 2>nul | findstr /I "!F_PID!" >nul 2>&1
        if !ERRORLEVEL! equ 0 (
            echo Stopping tracked Frontend process (PID !F_PID!)...
            taskkill /F /T /PID !F_PID! >nul 2>&1
            set /a STOPPED_COUNT+=1
        )
    )
    del /f /q "%PID_DIR%\frontend.pid" >nul 2>&1
)

rem 2. Check backend PID file
if exist "%PID_DIR%\backend.pid" (
    set /p B_PID=<"%PID_DIR%\backend.pid"
    set "B_PID=!B_PID: =!"
    if not "!B_PID!"=="" (
        tasklist /FI "PID eq !B_PID!" 2>nul | findstr /I "!B_PID!" >nul 2>&1
        if !ERRORLEVEL! equ 0 (
            echo Stopping tracked Backend process (PID !B_PID!)...
            taskkill /F /T /PID !B_PID! >nul 2>&1
            set /a STOPPED_COUNT+=1
        )
    )
    del /f /q "%PID_DIR%\backend.pid" >nul 2>&1
)

rem 3. Close open Realm Check command windows if remaining
taskkill /F /FI "WINDOWTITLE eq Realm Check - Backend*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Realm Check - Frontend*" >nul 2>&1

echo.
echo [2/3] Verification:
netstat -ano | findstr /R /C:":8081 .*LISTENING" >nul 2>&1
if !ERRORLEVEL! equ 0 (
    echo [NOTE] Port 8081 is still active (an external/manual background instance is running).
) else (
    echo [OK] Port 8081 (Backend) is clear.
)

netstat -ano | findstr /R /C:":5173 .*LISTENING" >nul 2>&1
if !ERRORLEVEL! equ 0 (
    echo [NOTE] Port 5173 is still active (an external/manual background instance is running).
) else (
    echo [OK] Port 5173 (Frontend) is clear.
)

echo.
echo [3/3] PostgreSQL Data Preservation Notice:
echo  ========================================================================
echo   PostgreSQL database data is fully PRESERVED in the docker volume/db.
echo   Database container 'realmcheck-db' was kept intact and ready for restart.
echo  ========================================================================
echo.
echo Realm Check services stopped safely.
echo.
timeout /t 4 >nul
