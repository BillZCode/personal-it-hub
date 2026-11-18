@echo off
title Personal IT Hub - Master Launcher
color 0A

echo ==========================================================
echo       PERSONAL IT HUB - WINDOWS DEVELOPMENT SERVER
echo ==========================================================
echo.

:: 1. Periksa apakah Node.js terinstal
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Node.js tidak ditemukan di PATH sistem Windows!
    echo Silakan unduh dan instal Node.js v20+ dari https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 2. Periksa node_modules
if not exist "node_modules\" (
    echo [!] Folder node_modules belum ada. Menginstal dependensi...
    call npm install
    if %ERRORLEVEL% neq 0 (
        color 0C
        echo [ERROR] Gagal menjalankan npm install.
        pause
        exit /b 1
    )
)

echo [✓] Node.js terdeteksi.
echo [✓] Menjalankan 5 Layanan Sekaligus:
echo     - Frontend (Port 3000)
echo     - Backend Core API (Port 3001)
echo     - Omni AI Service (Port 3002)
echo     - CyberLab LKS (Port 3003)
echo     - DevKit Suite (Port 3004)
echo.
echo Tekan Ctrl+C kapan saja untuk menghentikan seluruh server.
echo ==========================================================
echo.

call npm run dev

pause
