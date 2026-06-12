@echo off
cd /d "C:\Users\31170\feiyuluohua"

echo.
echo  ====================================
echo   飞雨落花的驿栈 — 本地预览
echo  ====================================
echo.

:: 启动本地服务器
start "" "http://localhost:3000/ouo"
npx next dev -p 3000

pause
