"use client";

import { useEffect, useState } from "react";
import ChoiceCard from "@/components/ChoiceCard";
import NavRow from "@/components/NavRow";
import { getMintConfig, setMintConfig } from "@/lib/mint-storage";

const NETWORKS = [
  {
    id: "neon-l1",
    title: "Neon Prime L1",
    subtitle: "王道のメインネット風。安定感重視で、手数料は標準的というイメージです。",
    badge: "HOT",
  },
  {
    id: "void-l2",
    title: "Void Rollup L2",
    subtitle: "取引をまとめて処理するL2風。手数料を抑えやすく、通信速度も軽い想定です。",
    badge: "ZK",
  },
  {
    id: "chrome-side",
    title: "Chrome Sidechain",
    subtitle: "実験向きのサイドチェーン風。まずは安い手数料で試したい人向けの雰囲気です。",
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
        まずは、どのブロックチェーンで使う想定にするかを選びます。
        仮想通貨ではネットワークごとに手数料や通信速度の体感が変わるため、その違いをつかむ入口です。
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
