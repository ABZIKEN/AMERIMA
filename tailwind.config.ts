import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#eef4ff",
        surface: "#ffffff",
        tint: "#e5efff",
        accent: "#7da8e8",
        accentDeep: "#5d8fd9",
        ink: "#10243f",
        muted: "#5f6f85",
        line: "#d5e2f8",
      },
      boxShadow: {
        device: "0 24px 60px rgba(26, 59, 110, 0.18)",
        card: "0 12px 30px rgba(33, 81, 150, 0.14)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        waves:
          "radial-gradient(circle at top right, rgba(93, 143, 217, 0.3), transparent 35%), linear-gradient(135deg, rgba(125,168,232,0.22), transparent 55%)",
      },
      keyframes: {
        pulseIn: {
          "0%": { opacity: "0", transform: "scale(0.85)" },
          "35%": { opacity: "1", transform: "scale(1.04)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        floatGlow: {
          "0%, 100%": { transform: "translateY(0px)", opacity: "0.55" },
          "50%": { transform: "translateY(-8px)", opacity: "1" },
        },
        screenEnter: {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.985)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        pulseIn: "pulseIn 1.2s ease-out forwards",
        floatGlow: "floatGlow 2.8s ease-in-out infinite",
        screenEnter: "screenEnter 320ms cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
