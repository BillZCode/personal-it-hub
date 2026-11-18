@echo off
title Personal IT Hub - PM2 Background Manager
color 0B

echo ==========================================================
echo       PERSONAL IT HUB - PM2 DAEMON LAUNCHER (WINDOWS)
echo ==========================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Node.js tidak ditemukan! Silakan instal Node.js terlebih dahulu.
    pause
    exit /b 1
)

echo [1/2] Menjalankan layanan via PM2 menggunakan ecosystem.config.cjs...
call npx pm2 start ecosystem.config.cjs

echo.
echo [2/2] Status Layanan:
call npx pm2 status

echo.
echo ==========================================================
echo Tips perintah PM2:
echo   - npx pm2 status         (Melihat status seluruh proses)
echo   - npx pm2 logs           (Melihat log real-time)
echo   - npx pm2 stop all       (Menghentikan seluruh proses)
echo   - npx pm2 restart all    (Restart seluruh proses)
echo ==========================================================
echo.
pause
