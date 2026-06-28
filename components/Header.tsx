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
                className={`group relative flex flex-col items-center px-3 py-1.5 text-sm tracking-wider transition-colors duration-300 ${
                  isActive ? "text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {/* CSS 水滴 — 椭圆 + ::before 三角 + ::after 尾线 */}
                <span
                  className={`absolute inset-0 rounded-[50%] border transition-all duration-300 ${
                    isActive
                      ? "border-[var(--primary)]/40 bg-[var(--primary)]/8"
                      : "border-[var(--border)]/25 bg-transparent group-hover:border-[var(--primary)]/30"
                  }`}
                  style={{
                    borderTopLeftRadius: "48% 48%",
                    borderTopRightRadius: "48% 48%",
                    borderBottomLeftRadius: "52% 52%",
                    borderBottomRightRadius: "52% 52%",
                  }}
                />
                {/* 顶部尖角 */}
                <span
                  className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[5px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent transition-all duration-300 ${
                    isActive ? "border-t-[var(--primary)]/40" : "border-t-[var(--border)]/25 group-hover:border-t-[var(--primary)]/30"
                  }`}
                />
                {/* 底部小尾巴 */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[3px] w-px transition-all duration-300 ${
                    isActive ? "h-[5px] bg-[var(--primary)]/40" : "h-[3px] bg-[var(--border)]/25 group-hover:h-[4px] group-hover:bg-[var(--primary)]/30"
                  }`}
                />
                <span className="relative z-[1]">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
