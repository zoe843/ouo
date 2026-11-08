import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "雨落花庭",
    short_name: "雨落花庭",
    description: "一个存放随笔与照片的小站",
    start_url: "/",
    display: "standalone",
    background_color: "#0c1824",
    theme_color: "#0c1824",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
