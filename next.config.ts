import type { NextConfig } from "next";

const BASE_PATH = process.env.BASE_PATH || "/ouo";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: BASE_PATH || undefined,
};

export default nextConfig;
