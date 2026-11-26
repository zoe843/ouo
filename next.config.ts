import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
