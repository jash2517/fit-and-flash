import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: "#0A0A0A",
        slateCard: "#141414",
        slateElevated: "#1A1A1A",
        neonAcid: "#CCFF00",
        cyberOrange: "#FF4D00",
        brandBerry: "#721133",
        brandPlum: "#3B091C",
        creamText: "#F5F5F5",
      },
      fontFamily: {
        heading: ["var(--font-fredoka)", "Fredoka", "sans-serif"],
        sans: ["var(--font-nunito)", "Nunito", "sans-serif"],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      fontSize: {
        "display-hero": ["66px", { lineHeight: "1.08", fontWeight: "600" }],
        "heading-lg": ["48px", { lineHeight: "1.15", fontWeight: "600" }],
        "heading-md": ["36px", { lineHeight: "1.2", fontWeight: "600" }],
        "body-luxury": ["21px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      animation: {
        "pulse-glow": "pulseGlow 2s infinite ease-in-out",
        "scan-line": "scanline 2.5s linear infinite",
        float: "float 4s ease-in-out infinite",
        "mascot-jump-smooth": "mascotJumpSmooth 2.2s cubic-bezier(0.34, 1.25, 0.64, 1) infinite",
        "mascot-shadow-jump": "mascotShadowJump 2.2s cubic-bezier(0.34, 1.25, 0.64, 1) infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 15px rgba(204, 255, 0, 0.4))" },
          "50%": { opacity: "0.7", filter: "drop-shadow(0 0 5px rgba(204, 255, 0, 0.15))" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        mascotJumpSmooth: {
          "0%, 100%": { transform: "translateY(0px) scale(1, 1)" },
          "12%": { transform: "translateY(8px) scale(1.08, 0.90)" },
          "38%": { transform: "translateY(-54px) scale(0.92, 1.08)" },
          "55%": { transform: "translateY(-62px) scale(1.01, 0.99)" },
          "74%": { transform: "translateY(-20px) scale(0.97, 1.04)" },
          "88%": { transform: "translateY(4px) scale(1.09, 0.90)" },
        },
        mascotShadowJump: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "12%": { transform: "scale(1.2)", opacity: "0.95" },
          "38%": { transform: "scale(0.55)", opacity: "0.2" },
          "55%": { transform: "scale(0.48)", opacity: "0.15" },
          "74%": { transform: "scale(0.75)", opacity: "0.45" },
          "88%": { transform: "scale(1.25)", opacity: "0.95" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

