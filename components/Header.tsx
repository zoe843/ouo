"use client";

import Link from "next/link";

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
    <header className="site-header">
      <div className="site-header-inner">
        <Link prefetch={false} href="/" className="site-brand">
          <svg className="site-brand-mark" width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
            <path className="site-brand-moon" d="M28.5 7.2C17.7 5.4 8.5 13.5 8.5 24.3c0 10.1 8 18.1 18 18.1 6.2 0 11.4-3 14.8-7.4C30.9 37.5 21.9 30.2 21.9 20.4c0-5.1 2.5-10 6.6-13.2Z" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
            <path className="site-brand-petal" d="M38.8 14.7c-6.7.4-10.6 4.5-9.4 10.4 6.3.2 10.3-3.4 9.4-10.4Z" />
            <path className="site-brand-petal-vein" d="m30.8 23.5 5.7-6.2" strokeWidth=".9" strokeLinecap="round" />
            <path className="site-brand-rain" d="m35.3 7.2-1.2 2.7m8.5 15.6-1.1 2.6" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          <span className="site-brand-name">雨落花庭</span>
        </Link>
        <nav className="site-nav" aria-label="主导航">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return <Link prefetch={false} key={item.href} href={item.href} aria-current={isActive ? "page" : undefined}>{item.label}</Link>;
          })}
        </nav>
      </div>
    </header>
  );
}
