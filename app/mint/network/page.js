"use client";

import { useEffect, useState } from "react";
import ChoiceCard from "@/components/ChoiceCard";
import NavRow from "@/components/NavRow";
import { getMintConfig, setMintConfig } from "@/lib/mint-storage";

const NETWORKS = [
  {
    id: "neon-l1",
    title: "Neon Prime L1",
    subtitle: "メインネットっぽい、はやそうなやつ。",
    badge: "HOT",
  },
  {
    id: "void-l2",
    title: "Void Rollup L2",
    subtitle: "まとめて処理する系。ちょっとダークな雰囲気。",
    badge: "ZK",
  },
  {
    id: "chrome-side",
    title: "Chrome Sidechain",
    subtitle: "実験向き。雰囲気で選んでもOK。",
    badge: "LAB",
  },
];

export default function MintNetworkPage() {
  const [networkId, setNetworkId] = useState(null);

  useEffect(() => {
    const c = getMintConfig();
    setNetworkId(c.networkId);
  }, []);

  function pick(id) {
    setNetworkId(id);
    setMintConfig({ networkId: id });
  }

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-white/50">
        Step 01 · Uplink target
      </p>
      <p className="mt-3 font-mono text-sm leading-relaxed text-white/65">
        どのチェーンに載せる想定にするか、好きなものを選んでください。
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {NETWORKS.map((n) => (
          <ChoiceCard
            key={n.id}
            selected={networkId === n.id}
            onSelect={() => pick(n.id)}
            title={n.title}
            subtitle={n.subtitle}
            badge={n.badge}
          />
        ))}
      </div>

      <NavRow
        backHref="/"
        nextHref="/mint/token-type"
        nextDisabled={!networkId}
      />
    </div>
  );
}
