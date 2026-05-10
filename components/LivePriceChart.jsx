"use client";

import { useEffect, useMemo, useState } from "react";
import PaperTrading from "@/components/PaperTrading";
import {
  formatJpyFromUsd,
  formatUsd,
  initialPriceFromSeed,
  nextPrice,
} from "@/lib/price-sim";

const MAX_POINTS = 140;
const TICK_MS = 550;

export default function LivePriceChart({ symbol = "TKN", seed = "neo" }) {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const p0 = initialPriceFromSeed(seed);
    const t0 = Date.now();
    setSeries([{ t: t0, p: p0 }]);

    const id = window.setInterval(() => {
      setSeries((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const p = nextPrice(last.p);
        const next = [...prev, { t: Date.now(), p }];
        if (next.length > MAX_POINTS) return next.slice(-MAX_POINTS);
        return next;
      });
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [seed]);

  const stats = useMemo(() => {
    if (series.length === 0) {
      return { changePct: 0, high: null, low: null, last: null, vol: 0 };
    }
    const first = series[0].p;
    const last = series[series.length - 1].p;
    if (series.length === 1) {
      return {
        changePct: 0,
        high: first,
        low: first,
        last,
        vol: 0,
      };
    }
    const changePct = ((last - first) / first) * 100;
    const highs = series.map((x) => x.p);
    const high = Math.max(...highs);
    const low = Math.min(...highs);
    let sum = 0;
    for (let i = 1; i < series.length; i++) {
      const r = Math.log(series[i].p / series[i - 1].p);
      sum += r * r;
    }
    const vol = Math.sqrt(sum / Math.max(1, series.length - 1)) * 100;
    return { changePct, high, low, last, vol };
  }, [series]);

  const view = useMemo(() => buildPath(series), [series]);

  const lastPrice = stats.last;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyber-cyan/70">
            Live · synthetic feed
          </p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-3xl tabular-nums text-white sm:text-4xl">
            <span>
              {stats.last != null ? formatUsd(stats.last) : "—"}{" "}
              <span className="font-mono text-lg text-white/40">USD</span>
            </span>
            {stats.last != null ? (
              <span className="font-mono text-xl text-white/65 sm:text-2xl">
                ¥{formatJpyFromUsd(stats.last)}
              </span>
            ) : null}
          </p>
        </div>
        <div className="text-right font-mono text-sm">
          <p
            className={
              stats.changePct >= 0 ? "text-emerald-400" : "text-rose-400"
            }
          >
            {stats.last != null ? (
              <>
                {stats.changePct >= 0 ? "+" : ""}
                {stats.changePct.toFixed(2)}%{" "}
                <span className="text-white/40">session</span>
              </>
            ) : (
              "—"
            )}
          </p>
          <p className="mt-1 text-[11px] text-white/45">
            σ est. {stats.vol.toFixed(3)}% · tick {TICK_MS}ms
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-[inset_0_0_80px_rgba(0,255,245,0.04)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "100% 14.28%",
          }}
        />
        <div className="relative aspect-[16/9] w-full min-h-[240px] sm:min-h-[320px]">
          {view ? (
            <svg
              className="h-full w-full"
              viewBox={`0 0 ${view.w} ${view.h}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="fillGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#00fff5" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ff00aa" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#00fff5" />
                  <stop offset="55%" stopColor="#b026ff" />
                  <stop offset="100%" stopColor="#ff00aa" />
                </linearGradient>
              </defs>
              <path d={view.area} fill="url(#fillGrad)" />
              <path
                d={view.line}
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth={view.stroke}
                vectorEffect="non-scaling-stroke"
              />
              {view.dot ? (
                <circle
                  cx={view.dot.x}
                  cy={view.dot.y}
                  r={view.dotR}
                  fill="#fff700"
                  opacity={0.95}
                />
              ) : null}
            </svg>
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-xs text-white/35">
              Initializing feed…
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-white/45">
          <span>
            {symbol}/USD · paper market ·{" "}
            <span className="text-cyber-magenta">noise model</span>
          </span>
          <span>{series.length} ticks</span>
        </div>
      </div>

      <PaperTrading symbol={symbol} price={lastPrice} />

      <div className="grid gap-3 font-mono text-xs sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          <p className="text-white/35">Session high</p>
          <p className="mt-1 tabular-nums text-emerald-300/90">
            {stats.high != null ? formatUsd(stats.high) : "—"}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          <p className="text-white/35">Session low</p>
          <p className="mt-1 tabular-nums text-rose-300/90">
            {stats.low != null ? formatUsd(stats.low) : "—"}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          <p className="text-white/35">Open (sim)</p>
          <p className="mt-1 tabular-nums text-white/80">
            {series.length ? formatUsd(series[0].p) : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

function buildPath(series) {
  if (series.length === 0) return null;
  const data =
    series.length === 1
      ? [series[0], { ...series[0], t: series[0].t + 1 }]
      : series;
  const n = data.length;
  const w = 1000;
  const h = 420;
  const pad = 24;
  const prices = data.map((s) => s.p);
  let min = Math.min(...prices);
  let max = Math.max(...prices);
  if (min === max) {
    min *= 0.998;
    max *= 1.002;
  }
  const span = max - min;
  const lo = min - span * 0.06;
  const hi = max + span * 0.06;
  const px = (i) => pad + (i / (n - 1)) * (w - pad * 2);
  const py = (p) => h - pad - ((p - lo) / (hi - lo)) * (h - pad * 2);

  const pts = data.map((s, i) => `${px(i).toFixed(2)},${py(s.p).toFixed(2)}`);
  const line = `M ${pts.join(" L ")}`;
  const lastX = px(n - 1);
  const baseY = h - pad;
  const area = `${line} L ${lastX.toFixed(2)},${baseY} L ${pad.toFixed(
    2,
  )},${baseY} Z`;

  const lx = px(n - 1);
  const ly = py(data[n - 1].p);

  return {
    w,
    h,
    line,
    area,
    stroke: 2.2,
    dot: { x: lx, y: ly },
    dotR: 5,
  };
}
