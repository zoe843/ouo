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
        <nav className="flex gap-6">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <a
                key={item.href}
                href={item.href}
                className={`group relative text-sm tracking-wide transition-colors duration-300 ${
                  isActive
                    ? "text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
                {/* 当前页下划线 */}
                <span
                  className={`absolute -bottom-1 left-1/2 h-px bg-[var(--primary)] transition-all duration-300 ease-out ${
                    isActive
                      ? "w-full -translate-x-1/2 opacity-100"
                      : "w-0 -translate-x-1/2 opacity-0 group-hover:w-full"
                  }`}
                />
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
