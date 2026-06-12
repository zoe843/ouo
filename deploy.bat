@echo off
cd /d "C:\Users\31170\feiyuluohua"
echo 正在部署到 GitHub Pages...
call npm run build
cd out
if exist .git rmdir /s /q .git
git init
git checkout -B gh-pages
git remote add origin git@github.com:zoe843/ouo.git
git add -A
git commit -m "deploy %date% %time%"
git push -f origin gh-pages
echo 完成！https://rainbloom.xin
cd ..
pause
