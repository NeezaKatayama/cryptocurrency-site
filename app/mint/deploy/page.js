"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import NavRow from "@/components/NavRow";
import { getMintConfig } from "@/lib/mint-storage";

export default function MintDeployPage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [cfg, setCfg] = useState(null);

  useEffect(() => {
    setCfg(getMintConfig());
  }, []);

  const lines = useMemo(
    () => [
      "Handshake lattice · OK",
      "Encoding bytecode · shimmer",
      "Broadcasting myth · pending",
      "Sealing block · neon pulse",
    ],
    [],
  );

  useEffect(() => {
    let current = 0;
    const id = window.setInterval(() => {
      current += 1;
      if (current < lines.length) {
        setPhase(current);
      } else {
        window.clearInterval(id);
        setPhase(lines.length - 1);
        window.setTimeout(() => router.replace("/mint/success"), 600);
      }
    }, 850);
    return () => window.clearInterval(id);
  }, [lines.length, router]);

  const pct = Math.min(
    100,
    Math.round(((phase + 1) / lines.length) * 100),
  );

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-white/50">
        Step 05 · Deploy pulse
      </p>
      <p className="mt-3 font-mono text-sm leading-relaxed text-white/65">
        ここでは、仮想通貨をネットワークへ送信しているような流れをシミュレーション表示しています。
        実際のガス代や承認待ちは発生せず、そのまま次の画面へ進みます。
      </p>

      <div className="mt-10 rounded-xl border border-cyber-cyan/30 bg-black/50 p-6 shadow-neonCyan">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyber-cyan/80">
            Broadcast
          </span>
          <span className="font-mono text-sm tabular-nums text-white/90">{pct}%</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-magenta transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <ul className="mt-6 space-y-2 font-mono text-xs text-white/55">
          {lines.map((line, i) => (
            <li
              key={line}
              className={
                i <= phase ? "text-cyber-cyan/90" : "text-white/25"
              }
            >
              {i <= phase ? "▸ " : "○ "}
              {line}
            </li>
          ))}
        </ul>
      </div>

      {cfg ? (
        <dl className="mt-8 grid gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 font-mono text-xs text-white/60 sm:grid-cols-2">
          <div>
            <dt className="text-white/35">Network</dt>
            <dd className="mt-1 text-white/85">{cfg.networkId ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-white/35">Archetype</dt>
            <dd className="mt-1 text-white/85">{cfg.tokenType ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-white/35">Asset</dt>
            <dd className="mt-1 text-white/85">
              {cfg.name || "—"}{" "}
              <span className="text-cyber-magenta">({cfg.symbol || "—"})</span>
            </dd>
          </div>
          <div>
            <dt className="text-white/35">Supply / decimals</dt>
            <dd className="mt-1 text-white/85">
              {cfg.supply || "—"} / {cfg.decimals ?? "—"}
            </dd>
          </div>
        </dl>
      ) : null}

      <NavRow backHref="/mint/economics" nextHref="/mint/success" nextLabel="結果へスキップ →" />
    </div>
  );
}
