"use client";

import { useMemo, useState } from "react";
import type { Murmur } from "@/lib/murmurs";
import MurmurCard from "./MurmurCard";

function daysInMonth(year: number, monthIdx: number): number {
  return new Date(year, monthIdx + 1, 0).getDate();
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function formatMonthLabel(monthKey: string): string {
  const [y, m] = monthKey.split("-");
  return `${y} 年 ${parseInt(m, 10)} 月`;
}

function formatDayDisplay(dayKey: string): string {
  return dayKey.replaceAll("-", ".");
}

function snippet(text: string, maxLen = 28): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length > maxLen ? `${oneLine.slice(0, maxLen)}…` : oneLine;
}

const RULER_DAYS = new Set([1, 10, 20, 30]);

export default function MurmurArchive({ murmurs }: { murmurs: Murmur[] }) {
  const { years, dayMap, monthMap, emojiList } = useMemo(() => {
    const yearSet = new Set<number>();
    const dMap = new Map<string, Murmur[]>();
    const mMap = new Map<string, Murmur[]>();
    const eCount = new Map<string, number>();

    for (const m of murmurs) {
      const y = parseInt(m.datetime.slice(0, 4), 10);
      if (!Number.isNaN(y)) yearSet.add(y);

      const dKey = m.datetime.slice(0, 10);
      const mKey = m.datetime.slice(0, 7);

      const dList = dMap.get(dKey);
      if (dList) dList.push(m);
      else dMap.set(dKey, [m]);

      const mList = mMap.get(mKey);
      if (mList) mList.push(m);
      else mMap.set(mKey, [m]);

      eCount.set(m.emoji, (eCount.get(m.emoji) ?? 0) + 1);
    }

    const sortedYears = Array.from(yearSet).sort((a, b) => b - a);
    const emojis = Array.from(eCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([emoji, count]) => ({ emoji, count }));

    return {
      years: sortedYears.length > 0 ? sortedYears : [new Date().getFullYear()],
      dayMap: dMap,
      monthMap: mMap,
      emojiList: emojis,
    };
  }, [murmurs]);

  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const yearPrefix = String(selectedYear);
  const { yearCount, activeDaysInYear } = useMemo(() => {
    let count = 0;
    const activeDays = new Set<string>();
    for (const m of murmurs) {
      if (m.datetime.startsWith(yearPrefix)) {
        count += 1;
        activeDays.add(m.datetime.slice(0, 10));
      }
    }
    return { yearCount: count, activeDaysInYear: activeDays.size };
  }, [murmurs, yearPrefix]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return murmurs.filter((m) => {
      if (selectedDay && m.datetime.slice(0, 10) !== selectedDay) return false;
      if (selectedMonth && m.datetime.slice(0, 7) !== selectedMonth) return false;
      if (selectedEmoji && m.emoji !== selectedEmoji) return false;
      if (q) {
        const hay = `${m.title ?? ""} ${m.body}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [murmurs, selectedDay, selectedMonth, selectedEmoji, query]);

  const groups = useMemo(() => {
    const list: { month: string; label: string; items: Murmur[] }[] = [];
    for (const m of filtered) {
      const month = m.datetime.slice(0, 7);
      const last = list[list.length - 1];
      if (last && last.month === month) {
        last.items.push(m);
      } else {
        list.push({
          month,
          label: formatMonthLabel(month),
          items: [m],
        });
      }
    }
    return list;
  }, [filtered]);

  const hasDateFilter = selectedDay !== null || selectedMonth !== null;
  const hasAnyFilter = hasDateFilter || selectedEmoji !== null || query.trim().length > 0;

  const previewKey = hoveredDay ?? selectedDay;
  const previewItems = previewKey ? (dayMap.get(previewKey) ?? []) : [];

  function handleYearChange(year: number) {
    setSelectedYear(year);
    setHoveredDay(null);
    if (selectedDay && !selectedDay.startsWith(String(year))) setSelectedDay(null);
    if (selectedMonth && !selectedMonth.startsWith(String(year))) setSelectedMonth(null);
  }

  function toggleDay(dayKey: string) {
    setSelectedMonth(null);
    setSelectedDay((prev) => (prev === dayKey ? null : dayKey));
  }

  function toggleMonth(monthKey: string) {
    setSelectedDay(null);
    setSelectedMonth((prev) => (prev === monthKey ? null : monthKey));
  }

  function clearDateFilter() {
    setSelectedDay(null);
    setSelectedMonth(null);
  }

  function resetAllFilters() {
    setSelectedDay(null);
    setSelectedMonth(null);
    setSelectedEmoji(null);
    setQuery("");
  }

  return (
    <div>
      {/* ——— 花期点阵 ——— */}
      <section
        aria-label="花期点阵"
        className="night-panel p-4 sm:p-6 mb-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="inline-flex items-center gap-2 font-serif text-base text-[#eceae4] tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bd96a7]" aria-hidden="true" />
              花期点阵
            </span>
            <span className="text-xs text-[var(--muted)]/85 tabular-nums">
              {yearCount} 念 · 落在 {activeDaysInYear} 个日子
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {years.length > 1 ? (
              <div className="flex items-center gap-1" role="group" aria-label="切换年份">
                {years.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => handleYearChange(y)}
                    aria-pressed={selectedYear === y}
                    className={
                      "px-2.5 py-0.5 rounded-full text-xs tabular-nums transition-colors " +
                      (selectedYear === y
                        ? "bg-[#c8a7b7]/20 text-[#f0e6ea] border border-[#c8a7b7]/40"
                        : "text-[var(--muted)]/75 hover:text-[var(--foreground)] border border-transparent")
                    }
                  >
                    {y}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-xs text-[var(--muted)]/70 tabular-nums">{selectedYear}</span>
            )}

            <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted)]/70" aria-hidden="true">
              <span>静</span>
              <span className="w-2 h-2 rounded-full bg-[#a4bac5]/12" />
              <span className="w-2 h-2 rounded-full bg-[#99788e]/85" />
              <span className="w-2 h-2 rounded-full bg-[#c69aad]" />
              <span className="w-2 h-2 rounded-full bg-[#e2bdcc] shadow-[0_0_6px_rgba(226,189,204,0.45)]" />
              <span>盛</span>
            </div>
          </div>
        </div>

        {/* 日期标尺 */}
        <div
          className="grid items-center gap-[2px] sm:gap-[4px] mb-1.5 text-[10px] text-[var(--muted)]/55 tabular-nums select-none"
          style={{ gridTemplateColumns: "2.35rem repeat(31, minmax(0, 1fr)) 1.65rem" }}
          aria-hidden="true"
        >
          <span />
          {Array.from({ length: 31 }, (_, i) => {
            const d = i + 1;
            return (
              <span key={d} className="text-center leading-none">
                {RULER_DAYS.has(d) ? d : ""}
              </span>
            );
          })}
          <span />
        </div>

        {/* 12 月 × 31 日花期网格 */}
        <div className="space-y-[5px] sm:space-y-[6px]">
          {Array.from({ length: 12 }, (_, monthIdx) => {
            const mNum = pad2(monthIdx + 1);
            const monthKey = `${selectedYear}-${mNum}`;
            const monthTotal = monthMap.get(monthKey)?.length ?? 0;
            const monthActive = selectedMonth === monthKey;
            const totalDays = daysInMonth(selectedYear, monthIdx);

            return (
              <div
                key={monthKey}
                className="grid items-center gap-[2px] sm:gap-[4px]"
                style={{ gridTemplateColumns: "2.35rem repeat(31, minmax(0, 1fr)) 1.65rem" }}
              >
                {monthTotal > 0 ? (
                  <button
                    type="button"
                    onClick={() => toggleMonth(monthKey)}
                    aria-pressed={monthActive}
                    aria-label={`筛选 ${selectedYear} 年 ${monthIdx + 1} 月（${monthTotal} 条）`}
                    className={
                      "text-left text-[11px] tabular-nums transition-colors rounded px-0.5 py-0.5 " +
                      (monthActive
                        ? "text-[#f0e6ea] bg-[#c8a7b7]/20"
                        : "text-[var(--muted)] hover:text-[#d9b8c4]")
                    }
                  >
                    {monthIdx + 1}月
                  </button>
                ) : (
                  <span className="text-left text-[11px] tabular-nums text-[var(--muted)]/35 px-0.5">
                    {monthIdx + 1}月
                  </span>
                )}

                {Array.from({ length: 31 }, (_, dayIdx) => {
                  const day = dayIdx + 1;
                  if (day > totalDays) {
                    return <span key={day} aria-hidden="true" />;
                  }
                  const dateKey = `${monthKey}-${pad2(day)}`;
                  const count = dayMap.get(dateKey)?.length ?? 0;
                  const isDaySelected = selectedDay === dateKey;

                  if (count === 0) {
                    return (
                      <span
                        key={dateKey}
                        className={
                          "block aspect-square w-full max-w-[10px] mx-auto rounded-full " +
                          (monthTotal > 0 ? "bg-[#a4bac5]/[0.13]" : "bg-[#a4bac5]/[0.07]")
                        }
                        aria-hidden="true"
                      />
                    );
                  }

                  const toneClass =
                    count >= 3
                      ? "bg-[#e2bdcc] shadow-[0_0_8px_rgba(226,189,204,0.45)]"
                      : count === 2
                        ? "bg-[#c69aad]"
                        : "bg-[#99788e]/90";

                  return (
                    <button
                      key={dateKey}
                      type="button"
                      onClick={() => toggleDay(dateKey)}
                      onMouseEnter={() => setHoveredDay(dateKey)}
                      onMouseLeave={() => setHoveredDay((prev) => (prev === dateKey ? null : prev))}
                      onFocus={() => setHoveredDay(dateKey)}
                      onBlur={() => setHoveredDay((prev) => (prev === dateKey ? null : prev))}
                      aria-label={`${selectedYear}年${monthIdx + 1}月${day}日，${count}条碎碎念`}
                      aria-pressed={isDaySelected}
                      title={`${formatDayDisplay(dateKey)} · ${count} 条`}
                      className={
                        "relative block aspect-square w-full max-w-[10px] mx-auto rounded-full transition-transform duration-200 hover:scale-125 focus-visible:scale-125 " +
                        toneClass +
                        (isDaySelected
                          ? " ring-2 ring-[#f3d9e5] ring-offset-1 ring-offset-[#0e1b28] scale-125"
                          : "")
                      }
                    />
                  );
                })}

                <span
                  className={
                    "text-right text-[10px] sm:text-[11px] tabular-nums " +
                    (monthTotal > 0 ? "text-[#c8a7b7]/85" : "text-[var(--muted)]/25")
                  }
                >
                  {monthTotal > 0 ? monthTotal : "·"}
                </span>
              </div>
            );
          })}
        </div>

        {/* 底部交互提示 / 选中预览 */}
        <div className="mt-4 pt-3 border-t border-[#a4bac5]/10 flex flex-wrap items-center justify-between gap-2 text-xs min-h-[28px]">
          <div className="text-[var(--muted)]/85 min-w-0 leading-relaxed">
            {previewKey && previewItems.length > 0 ? (
              <span>
                <span className="text-[#d9b8c4] tabular-nums">{formatDayDisplay(previewKey)}</span>
                <span className="mx-1.5 text-[var(--muted)]/45">·</span>
                <span>{previewItems.length} 念</span>
                <span className="mx-1.5 text-[var(--muted)]/45">·</span>
                <span className="text-[#d4dce0]/85">「{snippet(previewItems[0].body)}」</span>
              </span>
            ) : selectedMonth ? (
              <span>
                正在查看 <span className="text-[#d9b8c4]">{formatMonthLabel(selectedMonth)}</span> 的碎碎念
              </span>
            ) : (
              <span>点亮的花点对应写下碎碎念的日子，点按月份或花点可筛选</span>
            )}
          </div>

          {hasDateFilter && (
            <button
              type="button"
              onClick={clearDateFilter}
              className="text-[#d9b8c4] hover:text-[#f0e6ea] transition-colors flex-shrink-0"
            >
              清除日期筛选
            </button>
          )}
        </div>
      </section>

      {/* ——— 搜索与心情筛选 ——— */}
      <div className="mb-8 space-y-3">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜一句念头或关键词…"
            aria-label="搜索碎碎念"
            className="w-full rounded-lg border border-[#bdc7d0]/14 bg-[#0e1b28]/80 px-3.5 py-2 pr-14 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]/55 outline-none transition-colors focus:border-[#c8a7b7]/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              清空
            </button>
          )}
        </div>

        {emojiList.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="按心情筛选">
            <button
              type="button"
              onClick={() => setSelectedEmoji(null)}
              aria-pressed={selectedEmoji === null}
              className={
                "px-2.5 py-1 rounded-full text-xs border transition-colors " +
                (selectedEmoji === null
                  ? "bg-[#c8a7b7]/18 border-[#c8a7b7]/40 text-[#f0e6ea]"
                  : "border-[#bdc7d0]/12 text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[#bdc7d0]/25")
              }
            >
              全部 {murmurs.length}
            </button>
            {emojiList.map(({ emoji, count }) => {
              const active = selectedEmoji === emoji;
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(active ? null : emoji)}
                  aria-pressed={active}
                  aria-label={`筛选 ${emoji}（${count} 条）`}
                  className={
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-colors " +
                    (active
                      ? "bg-[#c8a7b7]/18 border-[#c8a7b7]/40 text-[#f0e6ea]"
                      : "border-[#bdc7d0]/12 text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[#bdc7d0]/25")
                  }
                >
                  <span>{emoji}</span>
                  <span className="tabular-nums text-[11px] opacity-80">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {hasAnyFilter && (
          <div className="flex items-center justify-between text-xs text-[var(--muted)]/80 pt-1">
            <span>找到 {filtered.length} 条念头</span>
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[#d9b8c4] hover:text-[#f0e6ea] transition-colors"
            >
              重置全部筛选
            </button>
          </div>
        )}
      </div>

      {/* ——— 按月列表 ——— */}
      {groups.length === 0 ? (
        <div className="night-panel text-center py-14 px-6 animate-float-up">
          <p className="text-sm text-[var(--muted)] tracking-wide">
            这组条件底下，暂时还没翻到念头。
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="mt-4 px-4 py-1.5 rounded-full border border-[#c8a7b7]/35 bg-[#c8a7b7]/12 text-xs text-[#eceae4] hover:bg-[#c8a7b7]/22 transition-colors"
          >
            查看全部碎碎念
          </button>
        </div>
      ) : (
        <div className="space-y-9">
          {groups.map((g) => (
            <section key={g.month}>
              <div className="flex items-center gap-3 mb-3 px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bd96a7] inline-block" aria-hidden="true" />
                <h2 className="font-serif text-sm tracking-widest text-[#d4dce0]">
                  {g.label}
                </h2>
                <span className="flex-1 h-px bg-[#a4bac5]/15" />
                <span className="text-xs text-[var(--muted)]/65 tabular-nums">{g.items.length} 条</span>
              </div>
              <div className="night-panel px-4 py-1.5 sm:px-5 sm:py-2">
                {g.items.map((murmur, i) => (
                  <MurmurCard key={`${murmur.datetime}-${i}`} murmur={murmur} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
