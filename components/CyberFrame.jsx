"use client";

export default function CyberFrame({ children, step, totalSteps, title }) {
  const pct = totalSteps ? Math.round((step / totalSteps) * 100) : 0;

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-cyber-void text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] animate-drift"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,245,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,170,0.28) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(176,38,255,0.12)_0%,_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/60 to-transparent" />

      <header className="relative z-10 border-b border-white/10 bg-black/40 px-4 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-display text-xs uppercase tracking-[0.35em] text-cyber-cyan/90">
            NeonMint<span className="text-cyber-magenta">OS</span>
            <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-cyber-amber shadow-neonMag" />
          </div>
          {totalSteps ? (
            <div className="font-mono text-[11px] text-cyber-cyan/70">
              ROUTE · SEGMENT {String(step).padStart(2, "0")} /{" "}
              {String(totalSteps).padStart(2, "0")}
            </div>
          ) : null}
        </div>
        {totalSteps ? (
          <div className="mx-auto mt-4 max-w-4xl">
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-magenta shadow-neonCyan transition-[width] duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : null}
        {title ? (
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-xl uppercase tracking-[0.2em] text-white sm:text-2xl">
            {title}
          </h1>
        ) : null}
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-8">
        {children}
      </main>

      <footer className="relative z-10 border-t border-white/10 px-4 py-6 text-center font-mono text-[10px] uppercase tracking-widest text-white/35 sm:px-8">
        Simulation only · No blockchain connection · Fiction protocol v0.9
      </footer>
    </div>
  );
}
