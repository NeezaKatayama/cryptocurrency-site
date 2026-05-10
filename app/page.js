import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-cyber-void">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,245,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,170,0.3) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-cyber-violet/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyber-magenta/15 blur-[90px]" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-cyber-cyan/80">
          Off-chain fiction protocol
        </p>
        <h1 className="mt-6 font-display text-4xl uppercase leading-tight tracking-tight text-white sm:text-6xl md:text-7xl animate-flicker">
          Mint your
          <span className="block bg-gradient-to-r from-cyber-cyan via-white to-cyber-magenta bg-clip-text text-transparent">
            synthetic token
          </span>
        </h1>
        <p className="mt-8 max-w-xl font-mono text-sm leading-relaxed text-white/60">
          いくつか選んで進むだけで、自分のトークンを「作った気分」になれます。
          本物のブロックチェーンにはつながっていません（見た目のシミュです）。
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/mint/network"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-lg border border-cyber-cyan bg-cyber-cyan/10 px-8 py-4 font-display text-xs uppercase tracking-[0.35em] text-white shadow-neonCyan transition hover:bg-cyber-cyan/20"
          >
            <span className="relative z-10">はじめる</span>
            <span className="relative z-10 font-mono text-cyber-cyan">↗</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition group-hover:translate-x-full duration-700" />
          </Link>
          <a
            href="#protocol"
            className="inline-flex items-center rounded-lg border border-white/15 px-6 py-4 font-mono text-xs uppercase tracking-widest text-white/55 hover:border-cyber-magenta/40 hover:text-white/90"
          >
            流れを見る
          </a>
        </div>

        <div
          id="protocol"
          className="mt-20 grid gap-6 border-t border-white/10 pt-12 sm:grid-cols-3"
        >
          {[
            {
              k: "01",
              t: "Routing",
              d: "どのチェーン想定にするか選びます。",
            },
            {
              k: "02",
              t: "Semantics",
              d: "役に立つ系・ミーム系・投票系など、タイプを決めます。",
            },
            {
              k: "03",
              t: "Pulse",
              d: "名前・発行枚数・小数の桁を入れて、発行の流れを終えます。",
            },
          ].map((item) => (
            <div
              key={item.k}
              className="rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm"
            >
              <p className="font-mono text-[10px] text-cyber-magenta">{item.k}</p>
              <p className="mt-2 font-display text-sm uppercase tracking-widest text-white">
                {item.t}
              </p>
              <p className="mt-3 font-mono text-xs leading-relaxed text-white/45">
                {item.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
