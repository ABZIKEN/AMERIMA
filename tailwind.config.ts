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
        background: "#f4f7f2",
        surface: "#ffffff",
        tint: "#dff4e6",
        accent: "#6bbf84",
        accentDeep: "#2f8f59",
        ink: "#183126",
        muted: "#6f7e76",
        line: "#d9e4db",
      },
      boxShadow: {
        device: "0 24px 60px rgba(20, 40, 29, 0.12)",
        card: "0 12px 30px rgba(20, 40, 29, 0.08)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        waves:
          "radial-gradient(circle at top right, rgba(70, 132, 255, 0.18), transparent 35%), linear-gradient(135deg, rgba(107,191,132,0.1), transparent 50%)",
      },
    },
  },
  plugins: [],
};

export default config;
