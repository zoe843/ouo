"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const STORAGE_KEY = "music-player-state";

interface PlayerState {
  playing: boolean;
  currentTime: number;
  timestamp: number;
}

/** 安全读取 sessionStorage 中的播放状态 */
function readStoredState(): PlayerState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlayerState;
    if (
      typeof parsed.playing !== "boolean" ||
      typeof parsed.currentTime !== "number" ||
      typeof parsed.timestamp !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** 安全写入播放状态到 sessionStorage */
function writeStoredState(state: PlayerState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 静默失败（存储满 / 隐私模式等）
  }
}

/** 安全清除 sessionStorage 中的播放状态 */
function clearStoredState(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // 静默失败
  }
}

/** 音符 + 暂停图标组件 */
function MusicIcon({ playing }: { playing: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" {...(playing ? { fill: "currentColor", stroke: "none" } : {})} />
      <circle cx="18" cy="16" r="3" {...(playing ? { fill: "currentColor", stroke: "none" } : {})} />
      {playing ? (
        <>
          <line x1="14" y1="5" x2="14" y2="10" strokeWidth="2" />
          <line x1="16" y1="3" x2="16" y2="9" strokeWidth="2" />
        </>
      ) : (
        <line x1="14" y1="10" x2="18" y2="14" strokeWidth="2.5" />
      )}
    </svg>
  );
}

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);

  // 同步 playing 到 ref，避免 interval/事件闭包陈旧
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    // ---- 1. 尝试恢复上次播放状态 ----
    const stored = readStoredState();
    if (stored && stored.playing) {
      if (stored.currentTime > 0) {
        audio.currentTime = stored.currentTime;
      }
      audio.play().then(() => {
        setPlaying(true);
      }).catch(() => {
        // 浏览器阻止 autoplay，静默降级；进度已恢复，用户点击即可继续
      });
    }

    // ---- 2. 定时保存 currentTime（播放中每 1 秒） ----
    const saveInterval = setInterval(() => {
      if (!audioRef.current || audioRef.current.paused) return;
      writeStoredState({
        playing: true,
        currentTime: audioRef.current.currentTime,
        timestamp: Date.now(),
      });
    }, 1000);

    // ---- 3. beforeunload：<a> 导航前的最终保存 ----
    const handleBeforeUnload = () => {
      if (!audioRef.current) return;
      writeStoredState({
        playing: !audioRef.current.paused,
        currentTime: audioRef.current.currentTime,
        timestamp: Date.now(),
      });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // ---- 4. visibilitychange：页面隐藏时保存（移动端兜底） ----
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current) {
        writeStoredState({
          playing: !audioRef.current.paused,
          currentTime: audioRef.current.currentTime,
          timestamp: Date.now(),
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // cleanup：保存最终状态
      clearInterval(saveInterval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (audioRef.current) {
        writeStoredState({
          playing: !audioRef.current.paused,
          currentTime: audioRef.current.currentTime,
          timestamp: Date.now(),
        });
      }
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      clearStoredState();
    } else {
      audio.play().then(() => {
        setPlaying(true);
        writeStoredState({
          playing: true,
          currentTime: audio.currentTime,
          timestamp: Date.now(),
        });
      }).catch(() => {
        // play() 失败，不更新 UI
      });
    }
  }, [playing]);

  return (
    <button
      onClick={toggle}
      title={playing ? "暂停音乐" : "播放音乐"}
      className={
        "fixed bottom-6 right-6 z-[200] w-10 h-10 rounded-full flex items-center justify-center border shadow-lg backdrop-blur-md transition-all duration-500 hover:scale-110 "
        + (playing
          ? "bg-[var(--primary)]/20 border-[var(--primary)]/40 text-[var(--primary)] shadow-[var(--primary)]/20"
          : "bg-[var(--card)]/80 border-[var(--border)]/40 text-[var(--muted)]")
      }
    >
      <MusicIcon playing={playing} />
    </button>
  );
}
