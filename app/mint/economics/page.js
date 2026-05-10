"use client";

import { useEffect, useState } from "react";
import NavRow from "@/components/NavRow";
import { getMintConfig, setMintConfig } from "@/lib/mint-storage";

export default function MintEconomicsPage() {
  const [supply, setSupply] = useState("");
  const [decimals, setDecimals] = useState("18");

  useEffect(() => {
    const c = getMintConfig();
    setSupply(c.supply || "");
    setDecimals(c.decimals || "18");
  }, []);

  useEffect(() => {
    setMintConfig({ supply, decimals });
  }, [supply, decimals]);

  const supplyNum = Number(supply.replace(/,/g, ""));
  const valid =
    supply.trim() !== "" &&
    Number.isFinite(supplyNum) &&
    supplyNum > 0 &&
    /^[0-9]+$/.test(decimals) &&
    Number(decimals) >= 0 &&
    Number(decimals) <= 24;

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-white/50">
        Step 04 · Economics
      </p>
      <p className="mt-3 font-mono text-sm leading-relaxed text-white/65">
        全部で何枚出すかと、小数点以下を何桁まで扱うかを決めます。
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyber-amber/90">
            総発行枚数
          </span>
          <input
            value={supply}
            onChange={(e) => setSupply(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="1000000000"
            className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 font-mono text-sm tabular-nums text-white outline-none transition placeholder:text-white/25 focus:border-cyber-amber/50 focus:ring-2 focus:ring-cyber-amber/25"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyber-violet/90">
            小数の桁（0〜24）
          </span>
          <input
            value={decimals}
            onChange={(e) => setDecimals(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="18"
            className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 font-mono text-sm tabular-nums text-white outline-none transition placeholder:text-white/25 focus:border-cyber-violet/60 focus:ring-2 focus:ring-cyber-violet/25"
          />
        </label>
      </div>

      <NavRow
        backHref="/mint/identity"
        nextHref="/mint/deploy"
        nextDisabled={!valid}
        nextLabel="発行の続きへ →"
      />
    </div>
  );
}
