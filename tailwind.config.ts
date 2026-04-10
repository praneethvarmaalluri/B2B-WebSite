import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0B0B",
        foreground: "#F8F8F8",
        card: "#111111",
        border: "#262626",
        muted: "#A1A1AA",
        accent: "#D62828",
        accentDark: "#B91C1C",
        offwhite: "#F5F5F5"
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 30px rgba(214, 40, 40, 0.25)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at top right, rgba(214,40,40,0.18), transparent 30%), radial-gradient(circle at bottom left, rgba(255,255,255,0.06), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;