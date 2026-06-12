export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)]/30 mt-20">
      <div className="max-w-3xl mx-auto px-6 py-8 text-center">
        <p className="text-sm text-[var(--muted)] tracking-wide">
          © {new Date().getFullYear()} 雨落花庭 · 某处安静存放文字与影像的地方
        </p>
      </div>
    </footer>
  );
}
