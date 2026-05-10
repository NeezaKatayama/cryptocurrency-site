"use client";

import { useEffect, useMemo, useState } from "react";
import PaperTrading from "@/components/PaperTrading";
import {
  formatJpyFromUsd,
  formatUsd,
  initialPriceFromSeed,
  nextPrice,
} from "@/lib/price-sim";

const MAX_POINTS = 240;
const TICK_MS = 220;

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
      return {
        change: 0,
        changePct: 0,
        high: null,
        low: null,
        last: null,
        open: null,
        vol: 0,
        drift: 0,
      };
    }
    const first = series[0].p;
    const last = series[series.length - 1].p;
    if (series.length === 1) {
      return {
        change: 0,
        changePct: 0,
        high: first,
        low: first,
        last,
        open: first,
        vol: 0,
        drift: 0,
      };
    }
    const change = last - first;
    const changePct = ((last - first) / first) * 100;
    const highs = series.map((x) => x.p);
    const high = Math.max(...highs);
    const low = Math.min(...highs);
    let sum = 0;
    let signed = 0;
    for (let i = 1; i < series.length; i++) {
      const r = Math.log(series[i].p / series[i - 1].p);
      sum += r * r;
      signed += r;
    }
    const vol = Math.sqrt(sum / Math.max(1, series.length - 1)) * 100;
    const drift = (signed / Math.max(1, series.length - 1)) * 100;
    return { change, changePct, high, low, last, open: first, vol, drift };
  }, [series]);

  const view = useMemo(() => buildChartModel(series), [series]);

  const lastPrice = stats.last;
  const trendUp = stats.changePct >= 0;
  const trendTone = trendUp
    ? "from-emerald-400/20 via-cyber-cyan/10 to-transparent"
    : "from-rose-500/20 via-cyber-magenta/10 to-transparent";
  const toneText = trendUp ? "text-emerald-300" : "text-rose-300";
  const changePrefix = stats.change >= 0 ? "+" : "";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.35em] text-cyber-cyan/70">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,255,170,0.9)] chart-pulse" />
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
            {changePrefix}
            {stats.change != null ? formatUsd(stats.change) : "—"} · σ est.{" "}
            {stats.vol.toFixed(3)}% · tick {TICK_MS}ms
          </p>
        </div>
      </div>

      <div className={`relative overflow-hidden rounded-[22px] border border-white/10 bg-black/50 shadow-[inset_0_0_120px_rgba(0,255,245,0.05),0_18px_70px_rgba(0,0,0,0.45)]`}>
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${trendTone}`} />
        <div className="pointer-events-none absolute left-0 top-0 h-40 w-40 rounded-full bg-cyber-cyan/10 blur-3xl chart-float" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-cyber-magenta/10 blur-3xl chart-float-delayed" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "100% 14.28%, 12.5% 100%",
          }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
          <div className="flex flex-wrap items-center gap-3">
            <span>{symbol}/USD</span>
            <span className="text-cyber-cyan/80">micro pulse</span>
            <span>{series.length} ticks</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-right">
            <span>drift {stats.drift >= 0 ? "+" : ""}{stats.drift.toFixed(3)}%</span>
            <span className={toneText}>range {stats.high && stats.low ? ((stats.high - stats.low) / stats.low * 100).toFixed(2) : "0.00"}%</span>
          </div>
        </div>
        <div className="relative aspect-[16/9] w-full min-h-[260px] sm:min-h-[360px]">
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
                <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fff700" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#ff00aa" stopOpacity="0.05" />
                </linearGradient>
                <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="dotGlow" x="-300%" y="-300%" width="700%" height="700%">
                  <feGaussianBlur stdDeviation="8" result="dotBlur" />
                  <feMerge>
                    <feMergeNode in="dotBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {view.priceLines.map((line) => (
                <g key={`y-${line.y}`}>
                  <line
                    x1={view.pad}
                    y1={line.y}
                    x2={view.w - view.pad}
                    y2={line.y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="4 8"
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={view.w - 10}
                    y={line.y - 6}
                    textAnchor="end"
                    fill="rgba(255,255,255,0.36)"
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {formatUsd(line.price)}
                  </text>
                </g>
              ))}

              {view.timeLines.map((line) => (
                <line
                  key={`x-${line}`}
                  x1={line}
                  y1={view.pad}
                  x2={line}
                  y2={view.h - view.pad}
                  stroke="rgba(255,255,255,0.05)"
                  strokeDasharray="4 10"
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {view.volumeBars.map((bar) => (
                <rect
                  key={`bar-${bar.x}`}
                  x={bar.x}
                  y={bar.y}
                  width={bar.w}
                  height={bar.h}
                  rx="1.5"
                  fill="url(#barGrad)"
                  opacity={bar.opacity}
                />
              ))}

              <path d={view.area} fill="url(#fillGrad)" />
              <path
                d={view.line}
                fill="none"
                stroke="rgba(0,255,245,0.16)"
                strokeWidth={view.stroke * 3.4}
                vectorEffect="non-scaling-stroke"
                filter="url(#lineGlow)"
              />
              <path
                d={view.line}
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth={view.stroke}
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1={view.pad}
                y1={view.dot.y}
                x2={view.w - view.pad}
                y2={view.dot.y}
                stroke="rgba(255,255,255,0.14)"
                strokeDasharray="6 8"
                vectorEffect="non-scaling-stroke"
              />
              {view.dot ? (
                <g filter="url(#dotGlow)">
                  <circle
                    cx={view.dot.x}
                    cy={view.dot.y}
                    r={view.dotR * 2.8}
                    fill="#fff700"
                    opacity={0.12}
                  />
                  <circle
                    cx={view.dot.x}
                    cy={view.dot.y}
                    r={view.dotR * 1.55}
                    fill="#00fff5"
                    opacity={0.24}
                  />
                  <circle
                    cx={view.dot.x}
                    cy={view.dot.y}
                    r={view.dotR}
                    fill="#fff700"
                    opacity={0.98}
                  />
                </g>
              ) : null}
              <rect
                x={view.w - 132}
                y={18}
                width={114}
                height={42}
                rx="10"
                fill="rgba(0,0,0,0.42)"
                stroke="rgba(255,255,255,0.08)"
              />
              <text
                x={view.w - 120}
                y={34}
                fill="rgba(255,255,255,0.4)"
                fontSize="10"
                fontFamily="monospace"
                letterSpacing="1.4"
              >
                LAST PRICE
              </text>
              <text
                x={view.w - 120}
                y={51}
                fill={trendUp ? "#86efac" : "#fda4af"}
                fontSize="14"
                fontFamily="monospace"
              >
                {stats.last != null ? formatUsd(stats.last) : "—"}
              </text>
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
            <span className="text-cyber-magenta">high-resolution sim feed</span>
          </span>
          <span>{MAX_POINTS}pt window</span>
        </div>
      </div>

      <PaperTrading symbol={symbol} price={lastPrice} />

      <div className="grid gap-3 font-mono text-xs sm:grid-cols-4">
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
            {stats.open != null ? formatUsd(stats.open) : "—"}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          <p className="text-white/35">Pulse delta</p>
          <p className={`mt-1 tabular-nums ${toneText}`}>
            {stats.change != null ? `${changePrefix}${formatUsd(stats.change)}` : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

function buildChartModel(series) {
  if (series.length === 0) return null;
  const data =
    series.length === 1
      ? [series[0], { ...series[0], t: series[0].t + 1 }]
      : series;
  const n = data.length;
  const w = 1000;
  const h = 480;
  const pad = 28;
  const volumeFloor = h - pad;
  const volumeBand = 74;
  const prices = data.map((s) => s.p);
  let min = Math.min(...prices);
  let max = Math.max(...prices);
  if (min === max) {
    min *= 0.998;
    max *= 1.002;
  }
  const span = max - min;
  const lo = min - span * 0.06;
  const hi = max + span * 0.09;
  const px = (i) => pad + (i / (n - 1)) * (w - pad * 2);
  const py = (p) =>
    h - pad - volumeBand - ((p - lo) / (hi - lo)) * (h - pad * 2 - volumeBand);

  const points = data.map((s, i) => ({ x: px(i), y: py(s.p), price: s.p }));
  const line = toSmoothPath(points);
  const lastX = px(n - 1);
  const baseY = h - pad - volumeBand + 18;
  const area = `${line} L ${lastX.toFixed(2)},${baseY.toFixed(2)} L ${pad.toFixed(
    2,
  )},${baseY.toFixed(2)} Z`;

  const lx = px(n - 1);
  const ly = py(data[n - 1].p);
  const priceLines = Array.from({ length: 5 }, (_, i) => {
    const t = i / 4;
    const price = hi - (hi - lo) * t;
    return { y: py(price), price };
  });
  const timeLines = Array.from({ length: 6 }, (_, i) => {
    const t = i / 5;
    return pad + t * (w - pad * 2);
  });
  const maxMove = Math.max(
    ...data.slice(1).map((point, i) => Math.abs(point.p - data[i].p)),
    1e-12,
  );
  const volumeBars = data.slice(1).map((point, i) => {
    const move = Math.abs(point.p - data[i].p);
    const strength = move / maxMove;
    const barH = 10 + strength * (volumeBand - 14);
    return {
      x: px(i + 1) - 1.35,
      y: volumeFloor - barH,
      w: 2.7,
      h: barH,
      opacity: 0.18 + strength * 0.5,
    };
  });

  return {
    w,
    h,
    pad,
    line,
    area,
    stroke: 2.4,
    dot: { x: lx, y: ly },
    dotR: 4.6,
    priceLines,
    timeLines,
    volumeBars,
  };
}

function toSmoothPath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) {
    return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  }

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(
      2,
    )} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}
