"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LivePriceChart from "@/components/LivePriceChart";
import { getMintConfig, resetMintConfig } from "@/lib/mint-storage";

export default function MintChartPage() {
  const [cfg, setCfg] = useState(null);

  useEffect(() => {
    setCfg(getMintConfig());
  }, []);

  const seed = useMemo(() => {
    if (!cfg) return "neon-genesis";
    return `${cfg.symbol}|${cfg.name}|${cfg.networkId}|${cfg.tokenType}`;
  }, [cfg]);

  const label = cfg?.symbol?.trim() || "TKN";

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-cyber-cyan/70">
        Step 07 · Synthetic market
      </p>
      <p className="mt-3 font-mono text-sm leading-relaxed text-white/65">
        発行後の値動きをイメージできるリアルタイム風チャートと、練習用の売買画面です。
        売買は表示中の価格で即時に反映されますが、外部データや本物のブロックチェーンには接続していません。
      </p>

      <div className="mt-6 rounded-lg border border-cyber-magenta/25 bg-cyber-magenta/5 px-4 py-3 font-mono text-xs text-white/70">
        <span className="text-white/40">Pair · </span>
        <span className="text-cyber-magenta">{label}</span>
        <span className="text-white/40"> / USD · </span>
        <span className="text-white/55">{cfg?.name || "unnamed asset"}</span>
      </div>

      <div className="mt-8">
        <LivePriceChart symbol={label} seed={seed} />
      </div>

      <div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-10">
        <Link
          href="/mint/network"
          onClick={() => resetMintConfig()}
          className="inline-flex rounded-lg border border-white/15 px-6 py-3 font-mono text-xs uppercase tracking-widest text-white/70 hover:border-cyber-cyan/40 hover:text-white"
        >
          ← Mint again
        </Link>
        <Link
          href="/"
          className="inline-flex rounded-lg border border-cyber-cyan bg-cyber-cyan/10 px-6 py-3 font-display text-xs uppercase tracking-[0.25em] text-white shadow-neonCyan hover:bg-cyber-cyan/20"
        >
          Terminal home
        </Link>
      </div>
    </div>
  );
}
