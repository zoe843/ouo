"use client";

import React from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首", icon: "🏠" },
  { href: "/essays", label: "文", icon: "✍" },
  { href: "/murmurs", label: "语", icon: "💭" },
  { href: "/photos", label: "影", icon: "📷" },
  { href: "/about", label: "我", icon: "🌿" },
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
        <nav className="flex items-center">
          {navItems.map((item, i) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <React.Fragment key={item.href}>
                {i > 0 && (
                  <span className="text-[var(--border)]/40 mx-1 select-none">·</span>
                )}
                <a
                  href={item.href}
                  className={`group relative px-2 py-1 text-xs tracking-wider transition-all duration-300 rounded-md ${
                    isActive
                      ? "text-[var(--foreground)] bg-[var(--primary)]/10"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--primary)]/5"
                  }`}
                >
                  {item.label}
                </a>
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
