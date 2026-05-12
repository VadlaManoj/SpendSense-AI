@echo off
echo ============================================
echo  Credex - Clean Install and Start
echo ============================================
cd /d D:\Credex

echo [1/3] Removing old node_modules...
rmdir /s /q node_modules
if exist package-lock.json del /f package-lock.json

echo [2/3] Installing dependencies (this may take 2-3 minutes)...
npm install

echo [3/3] Starting dev server...
npm run dev
pause
