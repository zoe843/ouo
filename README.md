# 飞雨落花的驿栈

一个存放随笔与照片的个人网站。

## 技术栈

- Next.js (App Router) + TypeScript
- Tailwind CSS (蓝调胶片风)
- MDX 随笔系统
- Vercel 部署

## 本地开发

```bash
npm install
npm run dev
```

打开 http://localhost:3000 预览。

## 部署

推送到 GitHub 后，Vercel 自动部署。

## 碎碎念手机发布（/post）

手机浏览器打开 `https://www.rainbloom.xin/post`（建议「添加到主屏幕」，像小 App 一样用），写一句话即可发布，一两分钟后出现在碎碎念页。终端脚本 `scripts/murmur.py` 仍然可用，两者互不影响。

原理：`/post` 页 POST 到 `/api/murmur`，服务端校验密码后调用 GitHub Contents API 更新 `content/murmurs.json` 并提交，push 自动触发 Vercel 重建。

### 环境变量（Vercel 项目 Settings → Environment Variables，及本地 `.env.local`）

| 变量 | 说明 |
| --- | --- |
| `MURMUR_PASS` | 发布密码，/post 页第一次使用时填写 |
| `GITHUB_TOKEN` | GitHub fine-grained PAT：Settings → Developer settings → Fine-grained tokens → Generate，仅勾选 `ouo` 仓库的 **Contents: Read and write**，过期时间自定义 |
| `GITHUB_REPO` | 可选，默认 `zoe843/ouo` |

### 本地测试

`.env.local` 里设 `DRY_RUN=1`（外加 `MURMUR_PASS`），此时 `/api/murmur` 只走校验流程、不真正提交 GitHub。
