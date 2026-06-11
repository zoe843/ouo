import MDXContent from "@/components/MDXContent";

const aboutSource = `
## 关于我

你好，我是飞雨落花驿栈的掌柜。

目前在西安一所211读电子信息工程，大二。梦想很朴素——有花不完的米。

中学时代接触过不少文学相关的东西，那段时间在心里埋下了种子，大概也是后来想做「飞雨落花的驿栈」的缘由吧。现在的生活说不上精彩，甚至有点枯燥，但好在我还有几个聊得来的朋友，这让日子不至于太闷。

希望以后依然如此，且越来越好。

---

### 这个地方

这个网站是临时起意搭起来的，不知道会不会一直用下去。主要是想记录一些随笔，也放放自己拍的照片。希望它能给我枯燥的生活，添上些许情调。

驿栈，是古时候旅人行路途中歇脚的地方。

我希望这个网站也能如此——你路过的时候，进来坐坐，看几篇文章，翻几张照片，然后继续自己的路。

---

### 找到我

- 📧 邮箱：3117059033@qq.com
- 💬 QQ：3117059033
- 💚 微信：a3117059033
- 📕 小红书：42951614019
- 🎵 抖音：81624948382

---

> 相寻梦里路，飞雨落花中
`;

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-20 pb-10">
      <div className="mb-12 animate-float-up">
        <h1 className="text-3xl font-light tracking-wider text-[var(--foreground)]">
          关于
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)] tracking-wide">
          关于这个驿站，和驿站背后的人
        </p>
      </div>

      <div className="animate-float-up" style={{ animationDelay: "100ms" }}>
        <MDXContent source={aboutSource} />
      </div>
    </div>
  );
}
