import type { MDXComponents } from "mdx/types";

export const components: MDXComponents = {
  h1: (props) => (
    <h1 className="text-2xl font-light tracking-wide mt-12 mb-4 text-[var(--foreground)]" {...props} />
  ),
  h2: (props) => (
    <h2 className="text-xl font-light tracking-wide mt-10 mb-3 text-[var(--foreground)]" {...props} />
  ),
  h3: (props) => (
    <h3 className="text-lg font-light tracking-wide mt-8 mb-3 text-[var(--foreground)]" {...props} />
  ),
  p: (props) => (
    <p className="my-4 leading-relaxed text-[var(--foreground)]/85" {...props} />
  ),
  a: (props) => (
    <a
      className="text-[var(--primary)] hover:underline underline-offset-4 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-2 border-[var(--primary)]/40 pl-4 my-6 italic text-[var(--muted)]"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="font-normal text-[var(--foreground)]" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc list-inside my-4 space-y-2 text-[var(--foreground)]/85" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal list-inside my-4 space-y-2 text-[var(--foreground)]/85" {...props} />
  ),
  hr: () => <hr className="my-10 border-[var(--border)]/30" />,
  code: (props) => (
    <code className="px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--accent)] text-sm" {...props} />
  ),
  pre: (props) => (
    <pre className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]/30 overflow-x-auto my-6 text-sm" {...props} />
  ),
};
