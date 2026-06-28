"use client";

import React from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/essays", label: "随笔" },
  { href: "/murmurs", label: "碎碎念" },
  { href: "/photos", label: "照片" },
  { href: "/about", label: "关于" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--background)]/80 border-b border-[var(--border)]/30">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 text-lg font-light tracking-wider text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300 group"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors duration-300 text-[var(--muted)] group-hover:text-[var(--primary)]"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <span>雨落花庭</span>
        </a>
        <nav className="flex items-center gap-3">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <a
                key={item.href}
                href={item.href}
                className={`group relative flex flex-col items-center px-3 py-1 text-sm tracking-wider transition-all duration-300 ease-out ${
                  isActive ? "text-[var(--primary)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {/* 水滴外框 SVG — 宽扁 viewBox 匹配文字 */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none select-none"
                  viewBox="0 0 80 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M40 3
                       C70 3 77 18 77 28
                       C77 38 68 45 56 45
                       L40 45
                       L24 45
                       C12 45 3 38 3 28
                       C3 18 10 3 40 3Z"
                    stroke="var(--primary)"
                    strokeWidth="1.2"
                    opacity={isActive ? 0.5 : 0.18}
                    className="transition-opacity duration-300"
                  />
                  {/* 顶部尖 */}
                  <path
                    d="M40 3 L43 10 L37 10Z"
                    fill="var(--primary)"
                    opacity={isActive ? 0.35 : 0.12}
                    className="transition-opacity duration-300"
                  />
                  {/* 底部尾 */}
                  <line
                    x1="64" y1="40" x2="64" y2="45"
                    stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round"
                    opacity={isActive ? 0.3 : 0.1}
                    className="transition-opacity duration-300"
                  />
                </svg>
                <span className="relative z-[1]">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
