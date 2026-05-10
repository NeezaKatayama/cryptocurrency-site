"use client";

import { usePathname } from "next/navigation";
import CyberFrame from "@/components/CyberFrame";

const STEPS = [
  { path: "/mint/network", title: "Lattice uplink" },
  { path: "/mint/token-type", title: "Archetype matrix" },
  { path: "/mint/identity", title: "Signal identity" },
  { path: "/mint/economics", title: "Economics core" },
  { path: "/mint/deploy", title: "Deploy pulse" },
  { path: "/mint/success", title: "Chain acknowledgment" },
  { path: "/mint/chart", title: "Live synthetic tape" },
];

export default function MintLayoutShell({ children }) {
  const pathname = usePathname();
  const idx = STEPS.findIndex((s) => s.path === pathname);
  const step = idx >= 0 ? idx + 1 : 1;
  const meta = STEPS[idx] ?? STEPS[0];

  return (
    <CyberFrame step={step} totalSteps={STEPS.length} title={meta.title}>
      {children}
    </CyberFrame>
  );
}
