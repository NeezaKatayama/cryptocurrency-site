/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          void: "#050508",
          grid: "#0d1525",
          cyan: "#00fff5",
          magenta: "#ff00aa",
          amber: "#fff700",
          violet: "#b026ff",
          dim: "#1a2332",
        },
      },
      fontFamily: {
        display: ["var(--font-orbitron)", "system-ui", "sans-serif"],
        mono: ["var(--font-share-tech)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        neonCyan: "0 0 20px rgba(0, 255, 245, 0.45), 0 0 60px rgba(0, 255, 245, 0.15)",
        neonMag: "0 0 20px rgba(255, 0, 170, 0.45), 0 0 60px rgba(255, 0, 170, 0.12)",
      },
      animation: {
        flicker: "flicker 4s infinite alternate",
        drift: "drift 18s linear infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "41%": { opacity: "1" },
          "42%": { opacity: "0.85" },
          "43%": { opacity: "1" },
          "45%": { opacity: "0.92" },
          "46%": { opacity: "1" },
        },
        drift: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(-40px, -40px)" },
        },
      },
    },
  },
  plugins: [],
};
