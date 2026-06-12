@echo off
cd /d "C:\Users\31170\feiyuluohua"

echo.
echo  ====================================
echo   网站管理工具
echo  ====================================
echo.
echo  1. 本地预览
echo  2. 部署上线
echo  3. 查看线上地址
echo.
set /p choice=请输入数字 (1/2/3):

if "%choice%"=="1" goto preview
if "%choice%"=="2" goto deploy
if "%choice%"=="3" goto urls
goto end

:preview
echo 正在启动本地服务器...
start "" "http://localhost:3000/ouo"
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
echo 正在推送...
cd out
if exist .git rmdir /s /q .git
git init
git checkout -B gh-pages
git remote add origin git@github.com:zoe843/ouo.git
git add -A
git commit -m "deploy %date% %time%"
git push -f origin gh-pages
echo 部署完成！https://zoe843.github.io/ouo/
cd ..
goto end

:urls
echo.
echo  线上: https://zoe843.github.io/ouo/
echo  仓库: https://github.com/zoe843/ouo
echo.

:end
pause
