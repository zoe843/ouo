import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rainbloom.xin"),
  title: {
    default: "雨落花庭",
    template: "%s · 雨落花庭",
  },
  description: "一个存放随笔与照片的小站",
  openGraph: {
    type: "website",
    siteName: "雨落花庭",
    locale: "zh_CN",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "雨落花庭" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1628",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <link rel="preload" as="image" href="/images/bg.webp" fetchPriority="high" />
        <link rel="alternate" type="application/rss+xml" title="雨落花庭" href="/rss.xml" />
      </head>
      <body className="min-h-full flex flex-col text-[var(--foreground)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MusicPlayer />
      </body>
    </html>
  );
}
