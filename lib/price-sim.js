/**
 * Crypto-ish random walk: log-normal returns with occasional fat-tail bursts.
 * Deterministic initial price from seed string for stable session open.
 */

export function hashSeedToUnit(seed) {
  let h = 2166136261;
  const s = String(seed || "genesis");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000000) / 1000000;
}

export function initialPriceFromSeed(seed) {
  const u = hashSeedToUnit(seed);
  const lo = 0.00042;
  const hi = 4280;
  return lo * Math.pow(hi / lo, u);
}

function randn() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function nextPrice(prev) {
  const p = Math.max(prev, 1e-12);
  const r = Math.random();
  let sigma = 0.0014 + Math.random() * 0.0006;
  if (r < 0.11) sigma *= 2.2;
  if (r < 0.035) sigma *= 3.8;
  if (r < 0.008) sigma *= 7;
  if (r < 0.002) sigma *= 14;
  let jump = randn() * sigma;
  if (Math.random() < 0.06) jump += (Math.random() - 0.45) * sigma * 6;
  const next = p * Math.exp(jump);
  return Math.min(Math.max(next, 1e-12), 1e15);
}

/** シミュ用の固定レート（実際の為替ではありません） */
export const USD_JPY_RATE = 155;

export function formatJpyFromUsd(usd) {
  if (!Number.isFinite(usd)) return "—";
  const jpy = Math.round(usd * USD_JPY_RATE);
  return jpy.toLocaleString("ja-JP");
}

export function formatUsd(n) {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1000)
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  if (abs >= 1)
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  if (abs >= 0.0001)
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    });
  return n.toExponential(4);
}
