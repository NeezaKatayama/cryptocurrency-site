"use client";

import { useEffect, useState } from "react";
import ChoiceCard from "@/components/ChoiceCard";
import NavRow from "@/components/NavRow";
import { getMintConfig, setMintConfig } from "@/lib/mint-storage";

const TYPES = [
  {
    id: "utility",
    title: "Utility surge",
    subtitle: "サービス内の支払い、会員特典、割引などに使う実用型のイメージです。",
    badge: "USE",
  },
  {
    id: "meme",
    title: "Meme nova",
    subtitle: "話題性やコミュニティの盛り上がりを重視した、ミームコイン風のタイプです。",
    badge: "VIBE",
  },
  {
    id: "gov",
    title: "Governance lattice",
    subtitle: "投票や提案に使い、コミュニティで方針を決める用途をイメージしたタイプです。",
    badge: "DAO",
  },
];

export default function MintTokenTypePage() {
  const [tokenType, setTokenType] = useState(null);

  useEffect(() => {
    const c = getMintConfig();
    setTokenType(c.tokenType);
  }, []);

  function pick(id) {
    setTokenType(id);
    setMintConfig({ tokenType: id });
  }

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-white/50">
        Step 02 · Archetype
      </p>
      <p className="mt-3 font-mono text-sm leading-relaxed text-white/65">
        次に、このトークンを何に使うのかを選びます。
        用途が決まると、どんな人に向けた仮想通貨なのかが伝わりやすくなります。
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {TYPES.map((t) => (
          <ChoiceCard
            key={t.id}
            selected={tokenType === t.id}
            onSelect={() => pick(t.id)}
            title={t.title}
            subtitle={t.subtitle}
            badge={t.badge}
          />
        ))}
      </div>

      <NavRow
        backHref="/mint/network"
        nextHref="/mint/identity"
        nextDisabled={!tokenType}
      />
    </div>
  );
}
