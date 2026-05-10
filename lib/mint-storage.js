import { resetPaperWallet } from "@/lib/paper-wallet";

const KEY = "cyber-mint-config";

export function getMintConfig() {
  if (typeof window === "undefined") return defaultConfig();
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return defaultConfig();
    return { ...defaultConfig(), ...JSON.parse(raw) };
  } catch {
    return defaultConfig();
  }
}

export function setMintConfig(partial) {
  if (typeof window === "undefined") return;
  const next = { ...getMintConfig(), ...partial };
  sessionStorage.setItem(KEY, JSON.stringify(next));
}

export function resetMintConfig() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
  resetPaperWallet();
}

function defaultConfig() {
  return {
    networkId: null,
    tokenType: null,
    name: "",
    symbol: "",
    supply: "",
    decimals: "18",
  };
}
