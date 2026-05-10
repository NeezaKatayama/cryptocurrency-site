"use client";

export default function ChoiceCard({
  selected,
  onSelect,
  title,
  subtitle,
  badge,
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative w-full rounded-xl border px-5 py-5 text-left transition-all duration-300 sm:px-6 sm:py-6 ${
        selected
          ? "border-cyber-cyan bg-cyber-cyan/10 shadow-neonCyan"
          : "border-white/15 bg-black/30 hover:border-cyber-magenta/50 hover:bg-cyber-magenta/5"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.25em] text-white">
            {title}
          </p>
          <p className="mt-2 font-mono text-xs leading-relaxed text-white/55">
            {subtitle}
          </p>
        </div>
        {badge ? (
          <span className="shrink-0 rounded border border-cyber-amber/40 bg-cyber-amber/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyber-amber">
            {badge}
          </span>
        ) : null}
      </div>
      <span
        className={`pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
          selected ? "opacity-40" : ""
        } bg-[linear-gradient(135deg,rgba(0,255,245,0.08),transparent_40%,rgba(255,0,170,0.06))]`}
      />
    </button>
  );
}
