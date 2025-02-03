import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        text: "var(--text)",
        background: "var(--background)",
        primary: {
          DEFAULT: "var(--primary)",
          50: "color-mix(in srgb, var(--primary) 50%, transparent)",
          70: "color-mix(in srgb, var(--primary) 70%, transparent)",
          90: "color-mix(in srgb, var(--primary) 90%, transparent)",
        },
        secondary: "var(--secondary)",
        accent: "var(--accent)",
      },
      fontSize: {
        sm: ["0.75rem", { lineHeight: "1.25" }],
        base: ["1rem", { lineHeight: "1.5" }],
        lg: ["1.333rem", { lineHeight: "1.5" }],
        xl: ["1.777rem", { lineHeight: "1.5" }],
        "2xl": ["2.369rem", { lineHeight: "1.5" }],
        "3xl": ["3.157rem", { lineHeight: "1.5" }],
      },
    },
  },
  plugins: [],
} satisfies Config;
