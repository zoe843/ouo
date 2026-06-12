@echo off
cd /d "C:\Users\31170\feiyuluohua"

echo 正在构建...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo 构建失败！
  pause
  exit /b 1
)

echo 正在推送...
cd out
git init
git checkout -B gh-pages
git remote add origin git@github.com:zoe843/ouo.git
git add -A
git commit -m "更新网站 %date% %time%"
git push -f origin gh-pages

echo 完成！等 2 分钟刷新 https://rainbloom.xin
pause
