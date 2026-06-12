import type { NextConfig } from "next";

// 日常开发 & 部署到 GitHub Pages 主域名：走 /ouo 路径
// 绑自定义域名时：设 BASE_PATH=root，去掉前缀
const BASE_PATH = process.env.BASE_PATH === "root" ? "" : "/ouo";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: BASE_PATH || undefined,
};

export default nextConfig;
