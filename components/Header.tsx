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

/* 包裹按钮的雨滴环 SVG */
const DropRing = ({ active }: { active: boolean }) => (
  <svg
    className="absolute -inset-2 pointer-events-none select-none"
    viewBox="0 0 120 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* 上边雨滴 */}
    {[
      { x: 10, y: 2, s: 0.7 },
      { x: 30, y: 1, s: 0.5 },
      { x: 60, y: 0, s: 0.65 },
      { x: 90, y: 1, s: 0.5 },
      { x: 108, y: 3, s: 0.55 },
    ].map((d, i) => (
      <g key={`t${i}`} opacity={active ? 0.7 : 0.25}>
        <path
          d="M0 0 C1.5 3 1.5 5.5 0.8 6.5 C0 7.5 -0.8 6.5 -0.8 6.5 C-0.8 6.5 -1.5 5.5 -1.5 3 C-1.5 1.5 0 0 0 0Z"
          fill="var(--primary)"
          transform={`translate(${d.x}, ${d.y}) scale(${d.s})`}
        />
      </g>
    ))}
    {/* 下边雨滴 */}
    {[
      { x: 14, y: 44, s: 0.55 },
      { x: 38, y: 46, s: 0.6 },
      { x: 60, y: 47, s: 0.5 },
      { x: 82, y: 45, s: 0.65 },
      { x: 104, y: 44, s: 0.5 },
    ].map((d, i) => (
      <g key={`b${i}`} opacity={active ? 0.7 : 0.25}>
        <path
          d="M0 0 C1.5 3 1.5 5.5 0.8 6.5 C0 7.5 -0.8 6.5 -0.8 6.5 C-0.8 6.5 -1.5 5.5 -1.5 3 C-1.5 1.5 0 0 0 0Z"
          fill="var(--primary)"
          transform={`translate(${d.x}, ${d.y}) scale(${d.s})`}
        />
      </g>
    ))}
    {/* 左右点缀小圆点 */}
    {[
      { x: 4, y: 26, r: 0.7 },
      { x: 116, y: 24, r: 0.8 },
      { x: 7, y: 14, r: 0.5 },
      { x: 113, y: 36, r: 0.6 },
    ].map((d, i) => (
      <circle
        key={`s${i}`}
        cx={d.x}
        cy={d.y}
        r={d.r}
        fill="var(--primary)"
        opacity={active ? 0.5 : 0.18}
      />
    ))}
    {/* 顶部微小星光 */}
    {[
      { x: 20, y: 8, r: 0.4 },
      { x: 48, y: 6, r: 0.35 },
      { x: 74, y: 5, r: 0.4 },
      { x: 98, y: 7, r: 0.35 },
    ].map((d, i) => (
      <circle
        key={`st${i}`}
        cx={d.x}
        cy={d.y}
        r={d.r}
        fill="var(--primary)"
        opacity={active ? 0.6 : 0.15}
      />
    ))}
  </svg>
);

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--background)]/80 border-b border-[var(--border)]/30">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* 站点名 + 小雨滴环绕 */}
        <a
          href="/"
          className="relative flex items-center gap-2 text-lg font-light tracking-wider text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300 group"
        >
          <DropRing active={false} />
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative transition-colors duration-300 text-[var(--muted)] group-hover:text-[var(--primary)]"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <span className="relative">雨落花庭</span>
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
                className={`group relative px-4 py-1.5 text-sm tracking-wider rounded-full transition-all duration-300 ease-out ${
                  isActive
                    ? "text-[var(--foreground)] bg-[var(--primary)]/12 border border-[var(--primary)]/20 shadow-[0_0_12px_rgba(74,158,255,0.1)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5 border border-transparent"
                }`}
              >
                {/* 雨滴包围环 */}
                <DropRing active={isActive} />
                <span className="relative">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
