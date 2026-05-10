import { Orbitron, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const shareTech = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech",
  display: "swap",
});

export const metadata = {
  title: "NeonMint OS — Token Simulation",
  description: "Cyberpunk token issuance simulation. No real blockchain.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={`${orbitron.variable} ${shareTech.variable}`}>
      <body className="font-mono cyber-scan min-h-[100dvh]">{children}</body>
    </html>
  );
}
