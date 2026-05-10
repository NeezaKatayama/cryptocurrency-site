"use client";

import { useEffect, useState } from "react";
import ChoiceCard from "@/components/ChoiceCard";
import NavRow from "@/components/NavRow";
import { getMintConfig, setMintConfig } from "@/lib/mint-storage";

const TYPES = [
  {
    id: "utility",
    title: "Utility surge",
    subtitle: "サービス内で使う・割引や特典に使う、といったイメージ。",
    badge: "USE",
  },
  {
    id: "meme",
    title: "Meme nova",
    subtitle: "勢いやノリ重視。ミームコインっぽい位置づけ。",
    badge: "VIBE",
  },
  {
    id: "gov",
    title: "Governance lattice",
    subtitle: "投票や提案でコミュニティで決める、というイメージ。",
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
        どんな用途のトークンにするか、近いものを選んでください。
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
