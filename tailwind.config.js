/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#FFFFFF",
        foreground: "#1E293B",
        card: "#FFFFFF",
        primary: {
          DEFAULT: "#F47920",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F8FAFC",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#FDEEE2",
          foreground: "#C75E12",
        },
        border: "#E2E8F0",
        chart2: "#F9A663",
        chart3: "#94A3B8",
        chart4: "#CBD5E1",
      },
      borderRadius: {
        xl: "0.75rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(15,23,42,0.04), 0 1px 3px 0 rgba(15,23,42,0.06)",
        soft: "0 4px 12px -2px rgba(15,23,42,0.06), 0 2px 4px -2px rgba(15,23,42,0.04)",
      },
    },
  },
  plugins: [],
};
