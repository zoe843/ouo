import Link from "next/link";
export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)]/30 mt-20">
      <div className="max-w-3xl mx-auto px-6 py-8 text-center space-y-4">
        {/* 导航 */}
        <nav className="flex justify-center gap-6">
          <Link prefetch={false} href="/" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            首页
          </Link>
          <Link prefetch={false} href="/essays" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            随笔
          </Link>
          <Link prefetch={false} href="/photos" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            照片
          </Link>
          <Link prefetch={false} href="/about" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            关于
          </Link>
          <a href="/rss.xml" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            RSS
          </a>
        </nav>

        {/* 引用 */}
        <p className="text-xs text-[var(--muted)]/70 tracking-wider font-serif italic">
          相寻梦里路，飞雨落花中
        </p>

        {/* Copyright */}
        <p className="text-xs text-[var(--muted)]/60 tracking-wide">
          © {new Date().getFullYear()} 雨落花庭 · 某处安静存放文字与影像的地方
        </p>
      </div>
    </footer>
  );
}
