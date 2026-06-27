import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";

export const metadata: Metadata = {
  title: "雨落花庭",
  description: "一个存放随笔与照片的小站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <link rel="preload" as="image" href="/images/bg.jpg" fetchPriority="high" />
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
