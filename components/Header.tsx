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

/* 环绕导航项的小雨滴 */
const NavDrops = ({ active }: { active: boolean }) => (
  <svg
    className="absolute inset-0 pointer-events-none select-none"
    viewBox="0 0 100 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {[
      { x: 6,  y: 4,  s: 0.7,  o: 0.25 },
      { x: 88, y: 6,  s: 0.6,  o: 0.2  },
      { x: 4,  y: 30, s: 0.5,  o: 0.18 },
      { x: 92, y: 28, s: 0.65, o: 0.22 },
      { x: 50, y: 3,  s: 0.45, o: 0.15 },
      { x: 96, y: 16, s: 0.4,  o: 0.12 },
    ].map((d, i) => (
      <g key={i} opacity={active ? d.o * 1.6 : d.o}>
        <path
          d="M0 0 C1.5 3 1.5 5.5 0.8 6.5 C0 7.5 -0.8 6.5 -0.8 6.5 C-0.8 6.5 -1.5 5.5 -1.5 3 C-1.5 1.5 0 0 0 0Z"
          fill="var(--primary)"
          transform={`translate(${d.x}, ${d.y}) scale(${d.s})`}
        />
      </g>
    ))}
  </svg>
);

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--background)]/80 border-b border-[var(--border)]/30">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 text-lg font-light tracking-wider text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300 group relative"
        >
          {/* 站点名小雨滴 */}
          <svg
            className="absolute inset-0 pointer-events-none select-none -inset-x-3 -inset-y-2"
            viewBox="0 0 120 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {[
              { x: 4, y: 3, s: 0.5, o: 0.2 },
              { x: 112, y: 5, s: 0.55, o: 0.18 },
              { x: 8, y: 22, s: 0.4, o: 0.15 },
              { x: 108, y: 20, s: 0.45, o: 0.16 },
            ].map((d, i) => (
              <g key={i} opacity={d.o}>
                <path
                  d="M0 0 C1.5 3 1.5 5.5 0.8 6.5 C0 7.5 -0.8 6.5 -0.8 6.5 C-0.8 6.5 -1.5 5.5 -1.5 3 C-1.5 1.5 0 0 0 0Z"
                  fill="var(--primary)"
                  transform={`translate(${d.x}, ${d.y}) scale(${d.s})`}
                />
              </g>
            ))}
          </svg>
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
        <nav className="flex items-center gap-1">
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
                <NavDrops active={isActive} />
                <span className="relative">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
