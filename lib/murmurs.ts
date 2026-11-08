import fs from "fs";
import path from "path";
import { autoEmoji } from "./emoji";

export interface Murmur {
  title?: string;
  body: string;
  datetime: string;
  emoji: string;
}

const murmursPath = path.join(process.cwd(), "content/murmurs.json");

export { autoEmoji };

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
