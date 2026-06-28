import fs from "fs";
import path from "path";

export interface Murmur {
  title?: string;
  body: string;
  datetime: string;
  emoji: string;
}

const murmursPath = path.join(process.cwd(), "content/murmurs.json");

/** 中文关键词 → emoji 映射 */
const KEYWORD_EMOJI: [string[], string][] = [
  [["开心", "快乐", "高兴", "幸福", "满足", "美好", "治愈", "温暖", "喜欢", "可爱", "甜"], "😊"],
  [["好笑", "哈哈", "笑死", "搞笑", "幽默", "笑"], "😂"],
  [["无语", "无奈", "服了", "离谱", "哭笑不得", "尴尬"], "😅"],
  [["生气", "愤怒", "气死", "讨厌", "烦", "恶心"], "😤"],
  [["悲伤", "难过", "伤心", "哭", "泪", "遗憾", "失落", "痛"], "😢"],
  [["焦虑", "紧张", "担心", "害怕", "恐惧", "慌", "不安"], "😰"],
  [["疲惫", "累", "困", "倦", "熬夜", "睡", "休息"], "😴"],
  [["心虚"], "🫣"],
  [["自嘲", "嘲讽", "讽刺"], "🤡"],
  [["感慨", "感叹", "时光", "岁月", "回忆", "怀念", "想念", "从前"], "🥲"],
  [["努力", "加油", "坚持", "奋斗", "拼命", "自律"], "💪"],
  [["感恩", "感谢", "谢谢", "幸运", "感恩"], "🙏"],
  [["思考", "反思", "想", "困惑", "迷茫", "纠结", "矛盾"], "🤔"],
  [["惊喜", "意外", "居然", "竟然", "哇", "妙"], "🤩"],
  [["安静", "平静", "平淡", "日常", "普通", "简单", "闲着"], "🌿"],
  [["吐槽", "无语", "离谱", "服了", "啊"], "💬"],
  [["食物", "吃", "好吃", "饭", "美食", "喝", "饮料", "咖啡", "茶"], "🍜"],
  [["音乐", "歌", "听", "耳机", "播放"], "🎵"],
  [["天气", "雨", "晴", "风", "雪", "冷", "热", "阴"], "🌦️"],
  [["猫", "狗", "宠物", "动物"], "🐾"],
  [["实验", "科研", "论文", "读", "学", "考试", "课"], "📝"],
  [["旅行", "出行", "旅游", "散步", "走路", "逛"], "🚶"],
  [["医院", "病", "药", "健康", "身体"], "🏥"],
  [["钱", "贵", "工资", "穷", "买"], "💸"],
  [["游戏", "玩", "动漫", "剧", "电影", "看"], "🎮"],
  [["朋友", "聊天", "社交", "聚会", "见面"], "👋"],
];

function matchEmoji(text: string): string | null {
  for (const [keywords, emoji] of KEYWORD_EMOJI) {
    for (const kw of keywords) {
      if (text.includes(kw)) return emoji;
    }
  }
  return null;
}

export function autoEmoji(title: string | undefined, body: string): string {
  const fromTitle = title ? matchEmoji(title) : null;
  if (fromTitle) return fromTitle;
  const fromBody = matchEmoji(body);
  if (fromBody) return fromBody;
  return "💭";
}

export function getAllMurmurs(): Murmur[] {
  if (!fs.existsSync(murmursPath)) return [];

  const raw = fs.readFileSync(murmursPath, "utf-8");
  const murmurs: Murmur[] = JSON.parse(raw);

  return murmurs
    .map((m) => ({
      ...m,
      emoji: m.emoji || autoEmoji(m.title, m.body),
    }))
    .sort((a, b) => (b.datetime > a.datetime ? 1 : -1));
}

export function getRecentMurmurs(count: number = 5): Murmur[] {
  return getAllMurmurs().slice(0, count);
}
