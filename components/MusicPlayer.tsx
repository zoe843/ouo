"use client";

import { useState, useRef, useEffect } from "react";

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <button
      onClick={toggle}
      title={playing ? "暂停音乐" : "播放音乐"}
      className={"fixed bottom-6 right-6 z-[200] w-10 h-10 rounded-full flex items-center justify-center border shadow-lg backdrop-blur-md transition-all duration-500 hover:scale-110 "
        + (playing
          ? "bg-[var(--primary)]/20 border-[var(--primary)]/40 text-[var(--primary)] shadow-[var(--primary)]/20"
          : "bg-[var(--card)]/80 border-[var(--border)]/40 text-[var(--muted)]")
      }
    >
      {/* 音符图标 */}
      {playing ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" fill="currentColor" stroke="none" />
          <circle cx="18" cy="16" r="3" fill="currentColor" stroke="none" />
          {/* 播放中的波动线 */}
          <line x1="14" y1="5" x2="14" y2="10" strokeWidth="2" />
          <line x1="16" y1="3" x2="16" y2="9" strokeWidth="2" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
          {/* 暂停斜线 */}
          <line x1="14" y1="10" x2="18" y2="14" strokeWidth="2.5" />
        </svg>
      )}
    </button>
  );
}
