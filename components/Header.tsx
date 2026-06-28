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

/* 单个大水滴包裹文字 */
const WaterDrop = ({ active }: { active: boolean }) => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none select-none"
    viewBox="0 0 100 40"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    preserveAspectRatio="none"
  >
    <path
      d="M50 2
         C82 2 98 14 98 22
         C98 32 90 38 80 39
         L50 39
         L20 39
         C10 38 2 32 2 22
         C2 14 18 2 50 2Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      opacity={active ? 0.5 : 0.2}
      className="transition-opacity duration-300"
    />
    {/* 顶部滴水尖 */}
    <path
      d="M50 2 L53 8 L47 8Z"
      fill="currentColor"
      opacity={active ? 0.35 : 0.12}
      className="transition-opacity duration-300"
    />
    {/* 底部小水珠 */}
    <circle cx="74" cy="36" r="2.5" fill="currentColor" opacity={active ? 0.3 : 0.1} />
    <circle cx="84" cy="34" r="1.8" fill="currentColor" opacity={active ? 0.25 : 0.08} />
  </svg>
);

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--background)]/80 border-b border-[var(--border)]/30">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* 站点名 */}
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
                className={`group relative px-5 py-2 text-sm tracking-wider transition-all duration-300 ease-out ${
                  isActive
                    ? "text-[var(--primary)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <WaterDrop active={isActive} />
                <span className="relative z-[1]">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
