@echo off
title Personal IT Hub - Cloudflare Tunnel (Windows)
color 0E

echo ==========================================================
echo       CLOUDFLARE TUNNEL - WINDOWS CONNECTOR
echo ==========================================================
echo.

:: 1. Cek credentials file
if not exist ".cloudflared\credentials.json" (
    color 0C
    echo [ERROR] File .cloudflared\credentials.json belum ditemukan!
    echo.
    echo Cara mengatasinya:
    echo 1. Saat Anda di Linux, jalankan perintah:
    echo    sudo cp /etc/cloudflared/f3669dad-e89a-41de-be62-ff7760d2ad9d.json .cloudflared/credentials.json
    echo    sudo chown $USER:$USER .cloudflared/credentials.json
    echo 2. Atau salin file JSON credentials tunnel Anda ke folder:
    echo    .cloudflared\credentials.json
    echo.
    pause
    exit /b 1
)

:: 2. Cari executable cloudflared
set CLOUDFLARED_BIN=cloudflared
where cloudflared >nul 2>nul
if %ERRORLEVEL% neq 0 (
    if exist ".cloudflared\cloudflared.exe" (
        set CLOUDFLARED_BIN=.cloudflared\cloudflared.exe
    ) else (
        echo [!] cloudflared tidak ditemukan di sistem.
        echo Mengunduh cloudflared.exe otomatis ke .cloudflared\ ...
        powershell -Command "Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile '.cloudflared\cloudflared.exe'"
        if exist ".cloudflared\cloudflared.exe" (
            set CLOUDFLARED_BIN=.cloudflared\cloudflared.exe
            echo [✓] Berhasil mengunduh cloudflared.exe
        ) else (
            color 0C
            echo [ERROR] Gagal mengunduh cloudflared.exe. Silakan unduh manual dari:
            echo https://github.com/cloudflare/cloudflared/releases
            pause
            exit /b 1
        )
    )
)

echo [✓] Menggunakan: %CLOUDFLARED_BIN%
echo [✓] Membuka Tunnel sabbilferdyansyah.my.id...
echo.

%CLOUDFLARED_BIN% tunnel --config .cloudflared\config-windows.yml run

pause
