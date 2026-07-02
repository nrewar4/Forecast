/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        background: "#FFFFFF",
        foreground: "#0F172A",
        card: "#FFFFFF",
        // Refined orange brand scale (DEFAULT keeps the existing #F47920).
        primary: {
          50: "#FEF4EC",
          100: "#FDE6D3",
          200: "#FACBA6",
          300: "#F8AE76",
          400: "#F69248",
          DEFAULT: "#F47920",
          500: "#F47920",
          600: "#DB6412",
          700: "#B44E0E",
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
        ink: "#0F172A",
        chart2: "#F9A663",
        chart3: "#94A3B8",
        chart4: "#CBD5E1",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(15,23,42,0.04), 0 1px 3px 0 rgba(15,23,42,0.06)",
        soft: "0 4px 12px -2px rgba(15,23,42,0.06), 0 2px 4px -2px rgba(15,23,42,0.04)",
        lift: "0 10px 30px -10px rgba(15,23,42,0.15), 0 4px 8px -4px rgba(15,23,42,0.08)",
        glow: "0 0 0 1px rgba(244,121,32,0.12), 0 12px 32px -12px rgba(244,121,32,0.35)",
      },
      // Emil Kowalski's strong easing curves — the built-in CSS easings are too weak.
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out-strong": "cubic-bezier(0.77, 0, 0.175, 1)",
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.23, 1, 0.32, 1) both",
        "fade-in": "fade-in 0.4s ease both",
        "scale-in": "scale-in 0.2s cubic-bezier(0.23, 1, 0.32, 1) both",
      },
    },
  },
  plugins: [],
};
