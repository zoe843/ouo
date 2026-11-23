import type { Metadata } from "next";
import MDXContent from "@/components/MDXContent";

export const metadata: Metadata = {
  title: "关于",
  description: "关于这个驿栈，和驿栈背后的人",
  alternates: { canonical: "/about" },
};

const aboutSource = `
## 关于我

你好，我是雨落花庭的掌柜。

目前在西安一所211读电子信息工程，大三。梦想很朴素——有花不完的米。

中学时代接触过不少文学相关的东西，那段时间在心里埋下了种子，大概也是后来想做「雨落花庭」的缘由吧。现在的生活说不上精彩，甚至有点枯燥，但好在我还有几个聊得来的朋友，这让日子不至于太闷。

希望以后依然如此，且越来越好。

---

## 这个地方

这个网站是临时起意搭起来的，不知道会不会一直用下去。主要是想记录一些随笔，也放放自己拍的照片。希望它能给我枯燥的生活，添上些许情调。

驿栈，是古时候旅人行路途中歇脚的地方。

我希望这个网站也能如此——你路过的时候，进来坐坐，看几篇文章，翻几张照片，然后继续自己的路。
`;

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 pt-14 sm:pt-20 pb-10">
      <header className="page-header animate-float-up">
        <div className="page-title-row">
          <span className="page-title-dot" aria-hidden="true" />
          <h1 className="page-title">关于</h1>
        </div>
        <p className="page-subtitle">
          关于这个驿栈，和驿栈背后的人
        </p>
      </header>

      <div
        className="night-panel px-6 py-7 sm:px-10 sm:py-8 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 animate-float-up"
        style={{ animationDelay: "60ms" }}
      >
        <MDXContent source={aboutSource} />
      </div>
    </div>
  );
}
