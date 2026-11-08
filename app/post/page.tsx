import type { Metadata } from "next";
import MurmurComposer from "@/components/MurmurComposer";

export const metadata: Metadata = {
  title: "悄悄说",
  description: "写一句碎碎念",
  robots: { index: false, follow: false },
};

export default function PostPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 pt-20 pb-10">
      <div className="mb-10 animate-float-up">
        <h1 className="font-serif text-3xl font-light tracking-wider text-[var(--foreground)]">
          悄悄说
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)] tracking-wide">
          写一句，一两分钟后出现在碎碎念页 🫧
        </p>
      </div>

      <div className="animate-float-up" style={{ animationDelay: "80ms" }}>
        <MurmurComposer />
      </div>
    </div>
  );
}
