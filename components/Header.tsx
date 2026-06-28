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

/* 单个小雨滴 SVG */
const Drop = ({ className }: { className?: string }) => (
  <svg
    width="6"
    height="9"
    viewBox="0 0 6 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M3 0 C4.8 3.5 5.5 6 5 7.5 C4.5 8.5 3 9 3 9 C3 9 1.5 8.5 1 7.5 C0.5 6 1.2 3.5 3 0Z"
      fill="currentColor"
    />
  </svg>
);

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--background)]/80 border-b border-[var(--border)]/30">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2.5 text-lg font-light tracking-wider text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300 group"
        >
          <Drop className="text-[var(--primary)]/25 group-hover:text-[var(--primary)]/60 transition-colors duration-300" />
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
          <Drop className="text-[var(--primary)]/25 group-hover:text-[var(--primary)]/60 transition-colors duration-300" />
        </a>
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <a
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-1 px-3.5 py-1.5 text-sm tracking-wider rounded-full transition-all duration-300 ease-out ${
                  isActive
                    ? "text-[var(--foreground)] bg-[var(--primary)]/12 border border-[var(--primary)]/20 shadow-[0_0_12px_rgba(74,158,255,0.1)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5 border border-transparent"
                }`}
              >
                <Drop className={`transition-all duration-300 ${isActive ? "text-[var(--primary)]/50" : "text-[var(--primary)]/15 group-hover:text-[var(--primary)]/30"}`} />
                <span>{item.label}</span>
                <Drop className={`transition-all duration-300 ${isActive ? "text-[var(--primary)]/50" : "text-[var(--primary)]/15 group-hover:text-[var(--primary)]/30"}`} />
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
