"use client";

import { useCallback, useEffect, useState } from "react";
import {
  buyWithUsd,
  getPaperWallet,
  sellTokens,
} from "@/lib/paper-wallet";
import {
  formatJpyFromUsd,
  formatUsd,
  USD_JPY_RATE,
} from "@/lib/price-sim";

function formatTok(n) {
  if (!Number.isFinite(n)) return "—";
  const a = Math.abs(n);
  if (a >= 1e9) return n.toExponential(4);
  if (a >= 1)
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  });
}

export default function PaperTrading({ symbol = "TKN", price }) {
  const [usd, setUsd] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState(null);

  const refresh = useCallback(() => {
    const w = getPaperWallet();
    setUsd(w.usd);
    setTokens(w.tokens);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const validPrice = Number.isFinite(price) && price > 0;
  const amtNum = parseFloat(String(amount).replace(/,/g, ""));
  const amtOk = Number.isFinite(amtNum) && amtNum > 0;

  function onBuy() {
    setMsg(null);
    if (!validPrice) {
      setMsg("価格が未取得です。");
      return;
    }
    const r = buyWithUsd(amtNum, price);
    if (!r.ok) {
      setMsg(r.error === "insufficient_usd" ? "USD が不足しています。" : "買えませんでした。");
      return;
    }
    setAmount("");
    refresh();
    setMsg(`約 ${formatTok(r.tokensOut)} ${symbol} を購入しました（手数料を含むシミュレーション結果です）`);
  }

  function onSell() {
    setMsg(null);
    if (!validPrice) {
      setMsg("価格が未取得です。");
      return;
    }
    const r = sellTokens(amtNum, price);
    if (!r.ok) {
      setMsg(
        r.error === "insufficient_token"
          ? `${symbol} が不足しています。`
          : "売れませんでした。",
      );
      return;
    }
    setAmount("");
    refresh();
    setMsg(
      `約 ${formatUsd(r.usdIn)} USD（¥${formatJpyFromUsd(r.usdIn)}）を受け取りました（手数料差引後のシミュレーション結果です）`,
    );
  }

  const maxBuyUsd = usd;
  const maxSellTok = tokens;

  return (
    <div className="rounded-xl border border-white/10 bg-black/45 p-4 backdrop-blur-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <p className="font-display text-[11px] uppercase tracking-[0.35em] text-cyber-magenta/90">
          Paper desk · market
        </p>
        <p className="font-mono text-[10px] text-white/40">
          手数料 0.10% ・ USD/JPY {USD_JPY_RATE}（固定）・ 練習用シミュレーション
        </p>
      </div>

      <div className="mt-4 grid gap-4 font-mono sm:grid-cols-2">
        <div className="rounded-xl border border-cyber-cyan/30 bg-cyber-cyan/5 px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/45 sm:text-xs">
            Cash (USD)
          </p>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 leading-none">
            <span className="tabular-nums text-xl text-cyber-cyan sm:text-2xl md:text-3xl">
              {formatUsd(usd)} USD
            </span>
            <span className="tabular-nums text-lg text-white/75 sm:text-xl md:text-2xl">
              ¥{formatJpyFromUsd(usd)}
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-cyber-magenta/30 bg-cyber-magenta/5 px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/45 sm:text-xs">
            Spot ({symbol})
          </p>
          <p className="mt-3 tabular-nums text-xl leading-none text-cyber-magenta sm:text-2xl md:text-3xl">
            {formatTok(tokens)}
          </p>
        </div>
      </div>

      <label className="mt-5 block">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/45">
          金額・数量入力欄（購入は USD / 売却は {symbol}）
        </span>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder={validPrice ? String(price.toFixed(6)) : "—"}
          className="mt-2 w-full rounded-lg border border-white/15 bg-black/60 px-4 py-3 font-mono text-sm tabular-nums text-white outline-none placeholder:text-white/25 focus:border-cyber-cyan/55 focus:ring-2 focus:ring-cyber-cyan/25"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider">
        <span className="text-white/35">Quick · Buy USD:</span>
        {[0.25, 0.5, 1].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setAmount(String(Math.min(maxBuyUsd, maxBuyUsd * r)))}
            className="rounded border border-white/15 px-2 py-1 text-white/55 hover:border-cyber-cyan/45 hover:text-white"
          >
            {r === 1 ? "Max" : `${r * 100}%`}
          </button>
        ))}
        <span className="mx-1 text-white/20">|</span>
        <span className="text-white/35">Sell {symbol}:</span>
        {[0.25, 0.5, 1].map((r) => (
          <button
            key={`s-${r}`}
            type="button"
            onClick={() =>
              setAmount(String(Math.min(maxSellTok, maxSellTok * r)))
            }
            className="rounded border border-white/15 px-2 py-1 text-white/55 hover:border-cyber-magenta/45 hover:text-white"
          >
            {r === 1 ? "Max" : `${r * 100}%`}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBuy}
          disabled={!amtOk || !validPrice}
          className="inline-flex flex-1 min-w-[120px] items-center justify-center rounded-lg border border-emerald-400/50 bg-emerald-500/15 px-4 py-3 font-display text-[11px] uppercase tracking-[0.25em] text-emerald-200 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Buy
        </button>
        <button
          type="button"
          onClick={onSell}
          disabled={!amtOk || !validPrice}
          className="inline-flex flex-1 min-w-[120px] items-center justify-center rounded-lg border border-rose-400/50 bg-rose-500/15 px-4 py-3 font-display text-[11px] uppercase tracking-[0.25em] text-rose-200 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Sell
        </button>
      </div>

      {msg ? (
        <p className="mt-4 font-mono text-[11px] leading-relaxed text-cyber-cyan/85">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
