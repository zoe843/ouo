import type { NextConfig } from "next";

const NOVELS_ORIGIN = "https://zoe843.github.io/rainbloom-novels";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/books/",
          destination: `${NOVELS_ORIGIN}/index.html`,
        },
        {
          source: "/books/:path+",
          destination: `${NOVELS_ORIGIN}/:path+`,
        },
      ],
    };
  },
};

export default nextConfig;
