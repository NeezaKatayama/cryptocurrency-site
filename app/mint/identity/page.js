"use client";

import { useEffect, useState } from "react";
import NavRow from "@/components/NavRow";
import { getMintConfig, setMintConfig } from "@/lib/mint-storage";

export default function MintIdentityPage() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  useEffect(() => {
    const c = getMintConfig();
    setName(c.name || "");
    setSymbol(c.symbol || "");
  }, []);

  useEffect(() => {
    setMintConfig({ name, symbol: symbol.toUpperCase() });
  }, [name, symbol]);

  const valid = name.trim().length >= 2 && symbol.trim().length >= 2;

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-white/50">
        Step 03 · Identity
      </p>
      <p className="mt-3 font-mono text-sm leading-relaxed text-white/65">
        トークンの名前と、取引所で見えるような略称（ティッカー）を入れてください。
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyber-cyan/80">
            トークン名
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：ネオ・ユキヒラ コイン"
            className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 font-mono text-sm text-white outline-none ring-cyber-cyan/0 transition placeholder:text-white/25 focus:border-cyber-cyan/60 focus:ring-2 focus:ring-cyber-cyan/30"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyber-magenta/80">
            略称（英字・3〜6文字）
          </span>
          <input
            value={symbol}
            maxLength={6}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="NYK"
            className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 font-mono text-sm uppercase tracking-widest text-white outline-none transition placeholder:text-white/25 focus:border-cyber-magenta/60 focus:ring-2 focus:ring-cyber-magenta/30"
          />
        </label>
      </div>

      <NavRow
        backHref="/mint/token-type"
        nextHref="/mint/economics"
        nextDisabled={!valid}
      />
    </div>
  );
}
