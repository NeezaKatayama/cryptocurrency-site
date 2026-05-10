"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMintConfig, resetMintConfig } from "@/lib/mint-storage";

const REDIRECT_MS = 4500;

function fakeHash(cfg) {
  const seed = `${cfg?.networkId}|${cfg?.tokenType}|${cfg?.name}|${cfg?.symbol}|${cfg?.supply}|${cfg?.decimals}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  const hex = [];
  for (let i = 0; i < 64; i++) {
    const n = Math.abs((h + i * 9973) % 16);
    hex.push(n.toString(16));
  }
  return `0x${hex.join("")}`;
}

export default function MintSuccessPage() {
  const router = useRouter();
  const [cfg, setCfg] = useState(null);
  const [remain, setRemain] = useState(Math.ceil(REDIRECT_MS / 1000));

  useEffect(() => {
    setCfg(getMintConfig());
  }, []);

  useEffect(() => {
    const end = Date.now() + REDIRECT_MS;
    const tick = window.setInterval(() => {
      const left = Math.max(0, end - Date.now());
      setRemain(Math.max(0, Math.ceil(left / 1000)));
    }, 250);
    const go = window.setTimeout(() => {
      router.replace("/mint/chart");
    }, REDIRECT_MS);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(go);
    };
  }, [router]);

  const hash = useMemo(() => (cfg ? fakeHash(cfg) : ""), [cfg]);

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-cyber-magenta/80">
        Step 06 · Acknowledgment
      </p>
      <p className="mt-3 font-mono text-sm leading-relaxed text-white/65">
        シミュレーション上でトークンの発行が完了しました。
        下の文字列は、実際の取引履歴に見立てたダミーのトランザクションハッシュです。
      </p>

      <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/5 px-3 py-2 font-mono text-[11px] text-cyber-cyan/90">
        <span className="text-white/45">Live chart in</span>
        <span className="tabular-nums text-white">{remain}s</span>
        <Link
          href="/mint/chart"
          className="ml-1 text-cyber-magenta underline-offset-2 hover:underline"
        >
          skip
        </Link>
      </p>

      <div className="mt-10 rounded-xl border border-cyber-magenta/40 bg-gradient-to-br from-cyber-magenta/10 via-black/60 to-cyber-cyan/10 p-6 shadow-neonMag">
        <p className="font-display text-lg uppercase tracking-[0.2em] text-white">
          Deployment sealed
        </p>
        <p className="mt-2 font-mono text-[11px] break-all text-cyber-cyan/90">
          {hash || "…"}
        </p>
      </div>

      {cfg ? (
        <div className="mt-8 space-y-4 font-mono text-sm">
          <p className="text-white/70">
            <span className="text-white/40">Name · </span>
            {cfg.name || "—"}
          </p>
          <p className="text-white/70">
            <span className="text-white/40">Symbol · </span>
            <span className="text-cyber-magenta">{cfg.symbol || "—"}</span>
          </p>
          <p className="text-white/70">
            <span className="text-white/40">Supply · </span>
            {cfg.supply || "—"}
          </p>
        </div>
      ) : null}

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/mint/chart"
          className="inline-flex rounded-lg border border-cyber-cyan bg-cyber-cyan/10 px-6 py-3 font-display text-xs uppercase tracking-[0.25em] text-white shadow-neonCyan hover:bg-cyber-cyan/20"
        >
          Open live chart →
        </Link>
        <Link
          href="/mint/network"
          onClick={() => resetMintConfig()}
          className="inline-flex rounded-lg border border-white/15 px-6 py-3 font-mono text-xs uppercase tracking-widest text-white/70 hover:border-white/30 hover:text-white"
        >
          New run
        </Link>
        <Link
          href="/"
          className="inline-flex rounded-lg border border-white/15 px-6 py-3 font-mono text-xs uppercase tracking-widest text-white/70 hover:border-white/30 hover:text-white"
        >
          Terminal home
        </Link>
      </div>
    </div>
  );
}
