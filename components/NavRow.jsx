"use client";

import Link from "next/link";

export default function NavRow({
  backHref,
  nextHref,
  nextDisabled,
  nextLabel = "続ける →",
}) {
  return (
    <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href={backHref}
        className="font-mono text-sm uppercase tracking-widest text-cyber-cyan/80 underline-offset-4 hover:text-cyber-cyan hover:underline"
      >
        ← 戻る
      </Link>
      {nextDisabled ? (
        <span className="inline-flex cursor-not-allowed items-center justify-center rounded-lg border border-white/10 bg-white/5 px-6 py-3 font-display text-xs uppercase tracking-[0.3em] text-white/25">
          {nextLabel}
        </span>
      ) : (
        <Link
          href={nextHref}
          className="inline-flex items-center justify-center rounded-lg border border-cyber-magenta bg-cyber-magenta/15 px-6 py-3 font-display text-xs uppercase tracking-[0.3em] text-white shadow-neonMag transition hover:bg-cyber-magenta/25"
        >
          {nextLabel}
        </Link>
      )}
    </div>
  );
}
