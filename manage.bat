@echo off
cd /d "C:\Users\31170\feiyuluohua"

echo.
echo  ====================================
echo   网站管理工具
echo  ====================================
echo.
echo  1. 本地预览
echo  2. 部署上线 (推送 GitHub → Vercel)
echo  3. 查看线上地址
echo.
set /p choice=请输入数字 (1/2/3):

if "%choice%"=="1" goto preview
if "%choice%"=="2" goto deploy
if "%choice%"=="3" goto urls
goto end

:preview
echo 正在启动本地服务器...
start "" "http://localhost:3000"
npx next dev -p 3000
goto end

:deploy
echo 正在构建...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo 构建失败！
  pause
  goto end
)
echo 正在推送代码到 GitHub (Vercel 会自动部署)...
git add -A
git commit -m "update %date% %time%"
git push origin main
echo 代码已推送，Vercel 将在 1-2 分钟内完成部署。
echo.
goto end

:urls
echo.
echo  线上: https://rainbloom.xin
echo        https://www.rainbloom.xin
echo  仓库: https://github.com/zoe843/ouo
echo.

:end
pause
