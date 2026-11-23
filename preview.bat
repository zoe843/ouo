@echo off
cd /d "%~dp0"

echo.
echo  ====================================
echo   Rainbloom Local Preview (port 3000)
echo  ====================================
echo.

start "" "http://localhost:3000"
npx next dev -H 0.0.0.0 -p 3000

pause
