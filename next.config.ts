import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: process.env.GH_PAGES === "1" ? "/ouo" : undefined,
};

export default nextConfig;
