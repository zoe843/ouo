import { autoEmoji } from "@/lib/emoji";

/**
 * 碎碎念发布接口。
 * 手机端 /post 页 POST 一条 {pass, body, emoji, datetime}，
 * 校验密码后用 GITHUB_TOKEN 调 GitHub Contents API 把新条目头插进 content/murmurs.json，
 * push 触发 Vercel 重建，一两分钟后在 /murmurs 出现。
 * DRY_RUN=1 时只走校验流程不真正提交（本地测试用）。
 */

const GITHUB_REPO = process.env.GITHUB_REPO ?? "zoe843/ouo";
const MURMUR_FILE = process.env.MURMUR_FILE ?? "content/murmurs.json";

interface MurmurEntry {
  body: string;
  datetime: string;
  emoji: string;
}

const DATETIME_RE = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
const MAX_BODY_LEN = 500;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function ghHeaders(auth: boolean): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (auth) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

export async function POST(request: Request) {
  let payload: { pass?: unknown; body?: unknown; emoji?: unknown; datetime?: unknown };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "请求格式不对" }, { status: 400 });
  }

  const pass = typeof payload.pass === "string" ? payload.pass : "";
  const body = typeof payload.body === "string" ? payload.body.trim() : "";
  const datetime = typeof payload.datetime === "string" ? payload.datetime : "";
  const emoji =
    typeof payload.emoji === "string" && payload.emoji && payload.emoji.length <= 16
      ? payload.emoji
      : undefined;

  if (!body) return Response.json({ error: "还没写内容呢" }, { status: 400 });
  if (body.length > MAX_BODY_LEN)
    return Response.json({ error: "太长了，碎碎念一句话就够" }, { status: 400 });
  if (!DATETIME_RE.test(datetime))
    return Response.json({ error: "时间格式不对" }, { status: 400 });

  if (pass === "" || pass !== (process.env.MURMUR_PASS ?? "")) {
    await sleep(1000); // 防爆破
    return Response.json({ error: "密码不对" }, { status: 401 });
  }

  const entry: MurmurEntry = {
    body,
    datetime,
    emoji: emoji ?? autoEmoji(undefined, body),
  };

  if (process.env.DRY_RUN === "1") {
    return Response.json({ ok: true, dryRun: true, entry });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) return Response.json({ error: "服务端还没配置 GITHUB_TOKEN" }, { status: 500 });

  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${MURMUR_FILE}`;

  // 取当前文件，拿 sha 和内容
  const res = await fetch(apiUrl, { headers: ghHeaders(true), cache: "no-store" });
  if (!res.ok) {
    return Response.json({ error: "读取仓库内容失败", detail: res.status }, { status: 502 });
  }
  const file = (await res.json()) as { sha: string; content: string };
  const current: MurmurEntry[] = JSON.parse(Buffer.from(file.content, "base64").toString("utf-8"));

  // 头插最新一条，与 murmur.py 的写入格式保持一致
  current.unshift(entry);
  const next = JSON.stringify(current, null, 2) + "\n";

  const put = await fetch(apiUrl, {
    method: "PUT",
    headers: { ...ghHeaders(true), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "add murmur",
      content: Buffer.from(next, "utf-8").toString("base64"),
      sha: file.sha,
    }),
  });
  if (!put.ok) {
    return Response.json({ error: "提交到 GitHub 失败", detail: put.status }, { status: 502 });
  }

  return Response.json({ ok: true });
}
