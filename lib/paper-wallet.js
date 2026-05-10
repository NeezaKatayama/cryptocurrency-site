const KEY = "cyber-paper-wallet";

const DEFAULT = { usd: 10000, tokens: 0 };

export function getPaperWallet() {
  if (typeof window === "undefined") return { ...DEFAULT };
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    const p = JSON.parse(raw);
    return {
      usd: Number.isFinite(p.usd) ? p.usd : DEFAULT.usd,
      tokens: Number.isFinite(p.tokens) ? p.tokens : DEFAULT.tokens,
    };
  } catch {
    return { ...DEFAULT };
  }
}

function save(w) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(w));
}

export function resetPaperWallet() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

const FEE = 0.001;

export function buyWithUsd(usdSpend, pricePerToken) {
  if (!(pricePerToken > 0)) return { ok: false, error: "invalid_price" };
  const spend = Number(usdSpend);
  if (!(spend > 0)) return { ok: false, error: "amount" };
  const w = getPaperWallet();
  if (spend > w.usd) return { ok: false, error: "insufficient_usd" };
  const afterFee = spend * (1 - FEE);
  const tokensOut = afterFee / pricePerToken;
  save({
    usd: w.usd - spend,
    tokens: w.tokens + tokensOut,
  });
  return { ok: true, tokensOut, feeUsd: spend * FEE };
}

export function sellTokens(tokenAmount, pricePerToken) {
  if (!(pricePerToken > 0)) return { ok: false, error: "invalid_price" };
  const amt = Number(tokenAmount);
  if (!(amt > 0)) return { ok: false, error: "amount" };
  const w = getPaperWallet();
  if (amt > w.tokens) return { ok: false, error: "insufficient_token" };
  const gross = amt * pricePerToken;
  const usdIn = gross * (1 - FEE);
  save({
    usd: w.usd + usdIn,
    tokens: w.tokens - amt,
  });
  return { ok: true, usdIn, feeUsd: gross * FEE };
}
