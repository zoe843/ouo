@echo off
cd /d "C:\Users\31170\feiyuluohua"

echo.
echo  ====================================
echo   Site manager
echo  ====================================
echo   1. local preview  (npm run dev)
echo   2. build + push   (Vercel auto deploy)
echo   3. show urls
echo.
set /p choice=Pick 1/2/3:

if "%choice%"=="1" goto preview
if "%choice%"=="2" goto deploy
if "%choice%"=="3" goto urls
goto end

:preview
echo starting dev server...
start "" "http://localhost:3000"
npx next dev -p 3000
goto end

:deploy
echo building...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo BUILD FAILED
  pause
  goto end
)
echo pushing to GitHub (Vercel deploys automatically)...
git add -A
git commit -m "update %date% %time%"
git push origin main
if %ERRORLEVEL% NEQ 0 (
  echo PUSH FAILED - turn on your VPN and run again
  pause
  goto end
)
echo pushed. Vercel will finish deploying in 1-2 min.
echo.
goto end

:urls
echo.
echo  site: https://rainbloom.xin  /  https://www.rainbloom.xin
echo  repo: https://github.com/zoe843/ouo
echo.

:end
pause
