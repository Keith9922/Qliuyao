import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f4ec",
          100: "#ece5d4",
          200: "#d8caa3",
          300: "#bda566",
          400: "#a07e3c",
          500: "#7a5a25",
          600: "#5a401a",
          700: "#3d2c14",
          800: "#251a0c",
          900: "#15110a",
          950: "#0c0a07",
        },
        gold: {
          50: "#fdf9eb",
          100: "#faefc4",
          200: "#f4dd8a",
          300: "#edc44e",
          400: "#e0a528",
          500: "#c4851d",
          600: "#a06517",
          700: "#7a4b15",
          800: "#5d3a16",
          900: "#3e2810",
        },
        cinnabar: {
          50: "#fbf1ec",
          100: "#f4d8cd",
          200: "#ecbeac",
          300: "#e7a08b",
          400: "#e07d65",
          500: "#c44a36",
          600: "#a23323",
          700: "#7c2618",
          800: "#561811",
          900: "#3a0f0a",
        },
        quantum: {
          50: "#eef3ff",
          100: "#dee9ff",
          200: "#bdd1ff",
          300: "#92aeff",
          400: "#6884ff",
          500: "#475bff",
          600: "#2f3df0",
          700: "#252fc0",
          800: "#1c2390",
          900: "#141968",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display)", "ui-serif", "serif"],
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "draw-line": "draw-line 1.2s ease-out forwards",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "rotate-slow": "rotate-slow 30s linear infinite",
        "qubit-collapse": "qubit-collapse 1.5s ease-out forwards",
        "ink-spread": "ink-spread 1.5s ease-out forwards",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "qubit-collapse": {
          "0%": { opacity: "0.3", transform: "scale(0.9)" },
          "60%": { opacity: "1", transform: "scale(1.1)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "ink-spread": {
          "0%": { opacity: "0", filter: "blur(10px)" },
          "100%": { opacity: "1", filter: "blur(0)" },
        },
      },
      backgroundImage: {
        "ink-grid":
          "linear-gradient(to right, rgba(189,165,102,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(189,165,102,0.04) 1px, transparent 1px)",
        "rice-paper":
          "radial-gradient(circle at 20% 35%, rgba(189,165,102,0.08), transparent 35%), radial-gradient(circle at 75% 80%, rgba(196,74,54,0.06), transparent 35%)",
      },
      boxShadow: {
        "glow-gold": "0 0 40px rgba(237,196,78,0.3)",
        "glow-quantum": "0 0 40px rgba(71,91,255,0.4)",
        "scroll": "0 4px 20px rgba(20,15,8,0.4), 0 0 0 1px rgba(189,165,102,0.15)",
      },
    },
  },
  plugins: [],
} satisfies Config;
