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
        background: "var(--background)",
        foreground: "var(--foreground)",
        paper: "#faf8f3",
        'paper-dark': "#2a2520",
        ink: "#2c2416",
        'ink-light': "#5a4a3a",
        'sepia-warm': "#f5ebe0",
      },
      fontFamily: {
        serif: ['var(--font-merriweather)', 'Georgia', 'serif'],
        handwriting: ['var(--font-courier)', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml,%3Csvg width=\"200\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" /%3E%3C/filter%3E%3Crect width=\"200\" height=\"200\" filter=\"url(%23noise)\" opacity=\"0.05\"/%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
};
export default config;
