"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { autoEmoji, COMMON_EMOJI, FALLBACK_EMOJI } from "@/lib/emoji";

const PASS_KEY = "murmur-pass";
const MAX_LEN = 500;

function localDatetime(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

type Status = "idle" | "sending" | "ok" | "error";

export default function MurmurComposer() {
  const [body, setBody] = useState("");
  const [emoji, setEmoji] = useState(FALLBACK_EMOJI);
  const [pass, setPass] = useState("");
  const [needPass, setNeedPass] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  // 猜测的 emoji 随输入实时变化
  const guessed = useMemo(
    () => (body.trim() ? autoEmoji(undefined, body) : FALLBACK_EMOJI),
    [body],
  );
  const candidates = useMemo(
    () => [guessed, ...COMMON_EMOJI.filter((e) => e !== guessed)].slice(0, 14),
    [guessed],
  );

  useEffect(() => {
    setEmoji(guessed);
  }, [guessed]);

  useEffect(() => {
    const saved = localStorage.getItem(PASS_KEY);
    if (saved) setPass(saved);
    taRef.current?.focus();
  }, []);

  async function send() {
    const text = body.trim();
    if (!text || status === "sending") return;

    if (!pass) {
      setNeedPass(true);
      setStatus("error");
      setMsg("第一次用，先设一个发布密码");
      return;
    }

    setStatus("sending");
    setMsg("");
    localStorage.setItem(PASS_KEY, pass);

    try {
      const res = await fetch("/api/murmur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pass, body: text, emoji, datetime: localDatetime() }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (res.ok) {
        setStatus("ok");
        setMsg("已送达 🫧 一两分钟后就会出现在碎碎念页");
        setBody("");
        setNeedPass(false);
      } else if (res.status === 401) {
        localStorage.removeItem(PASS_KEY);
        setPass("");
        setNeedPass(true);
        setStatus("error");
        setMsg(data.error ?? "密码不对");
      } else {
        setStatus("error");
        setMsg(data.error ?? `发送失败（${res.status}）`);
      }
    } catch {
      setStatus("error");
      setMsg("网络不对劲，一会儿再试");
    }
  }

  const inputCls =
    "w-full rounded-xl border border-[var(--border)]/40 bg-[var(--card)]/60 px-4 py-3 " +
    "text-[var(--foreground)]/90 placeholder:text-[var(--muted)]/40 outline-none " +
    "transition-colors focus:border-[var(--primary)]/60";

  return (
    <div className="space-y-4">
      {needPass && (
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="发布密码"
          autoComplete="off"
          className={inputCls + " text-base"}
        />
      )}

      <textarea
        ref={taRef}
        value={body}
        rows={4}
        maxLength={MAX_LEN}
        onChange={(e) => {
          setBody(e.target.value);
          if (status !== "sending") setStatus("idle");
        }}
        placeholder="随便说点什么…"
        className={inputCls + " resize-none text-[16px] leading-relaxed"}
      />

      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {candidates.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={
                "text-lg rounded-full px-1.5 py-0.5 transition-all select-none " +
                (emoji === e
                  ? "bg-[var(--primary)]/25 scale-110"
                  : "opacity-55 hover:opacity-100")
              }
              aria-label={`选择表情 ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-[var(--muted)]/50 flex-shrink-0 pb-1">
          {body.length}/{MAX_LEN}
        </span>
      </div>

      <button
        type="button"
        onClick={send}
        disabled={status === "sending" || !body.trim()}
        className="w-full rounded-full bg-[var(--primary)]/90 py-3 text-sm font-light tracking-[0.3em] text-[#0c1824] transition-all hover:bg-[var(--primary)] disabled:opacity-40"
      >
        {status === "sending" ? "送达中…" : "说出去"}
      </button>

      {msg && (
        <p
          className={
            "text-sm tracking-wide text-center " +
            (status === "ok" ? "text-[var(--primary)]" : "text-[var(--muted)]")
          }
        >
          {msg}
        </p>
      )}
    </div>
  );
}
