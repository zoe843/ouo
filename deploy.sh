# 飞雨落花的驿栈 — 部署脚本
# 以后添加/修改了照片或随笔，双击 deploy.bat 或运行这条命令即可

# 1. 修改照片：编辑 content/photos/photos.json，图片放到 public/images/photos/
# 2. 修改随笔：编辑 content/essays/ 下的 .mdx 文件
# 3. 运行此脚本

cd "C:\Users\31170\feiyuluohua"
npm run build
cd out
git init && git checkout -B gh-pages
git remote add origin git@github.com:zoe843/ouo.git
git add -A
git commit -m "更新网站 $(date '+%Y-%m-%d %H:%M')"
git push -f origin gh-pages
echo "完成！等 2 分钟后刷新网站"
