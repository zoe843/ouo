import type { Metadata } from "next";
import MurmurComposer from "@/components/MurmurComposer";

export const metadata: Metadata = {
  title: "悄悄说",
  description: "写一句碎碎念",
  robots: { index: false, follow: false },
};

export default function PostPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-14 sm:pt-20 pb-10">
      <header className="page-header animate-float-up">
        <div className="page-title-row">
          <span className="page-title-dot" aria-hidden="true" />
          <h1 className="page-title">悄悄说</h1>
        </div>
        <p className="page-subtitle">
          写一句，一两分钟后出现在碎碎念页
        </p>
      </header>

      <div className="night-panel p-5 sm:p-6 animate-float-up" style={{ animationDelay: "60ms" }}>
        <MurmurComposer />
      </div>
    </div>
  );
}
