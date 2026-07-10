/** @type {import('tailwindcss').Config} */
// Design tokens follow the Vercel/Geist direction: a pure neutral gray scale,
// near-black ink, hairline borders instead of heavy shadows, and one warm
// accent (the APAC brand orange) spent sparingly and deliberately.
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
        foreground: "#171717",
        card: "#FFFFFF",
        // Brand orange scale (DEFAULT keeps the existing #F47920).
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
          DEFAULT: "#FAFAFA",
          foreground: "#666666",
        },
        accent: {
          DEFAULT: "#FDEEE2",
          foreground: "#C75E12",
        },
        border: "#EAEAEA",
        ink: "#0A0A0A",
        // Cool supporting hues used only for status/secondary marks.
        teal: "#0D9488",
        chart2: "#F9A663",
        chart3: "#8B8B8B",
        chart4: "#D4D4D4",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        // Hairline-first: a crisp ring plus a whisper of depth. Vercel-style.
        card: "0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 4px 0 rgba(0,0,0,0.04)",
        soft: "0 2px 8px -2px rgba(0,0,0,0.06), 0 1px 3px -1px rgba(0,0,0,0.04)",
        lift: "0 12px 32px -12px rgba(0,0,0,0.18), 0 4px 10px -6px rgba(0,0,0,0.10)",
        glow: "0 0 0 1px rgba(244,121,32,0.14), 0 14px 34px -14px rgba(244,121,32,0.40)",
        hairline: "inset 0 0 0 1px rgba(0,0,0,0.07)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out-strong": "cubic-bezier(0.77, 0, 0.175, 1)",
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
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
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up-in": {
          from: { opacity: "0", transform: "translateY(16px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.82)" },
        },
        "chat-pop": {
          from: { opacity: "0", transform: "translateY(24px) scale(0.96)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "bounce-dots": {
          "0%, 80%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "40%": { transform: "translateY(-4px)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.23, 1, 0.32, 1) both",
        "fade-in": "fade-in 0.4s ease both",
        "scale-in": "scale-in 0.2s cubic-bezier(0.23, 1, 0.32, 1) both",
        "slide-down": "slide-down 0.3s cubic-bezier(0.23, 1, 0.32, 1) both",
        "slide-up-in": "slide-up-in 0.5s cubic-bezier(0.23, 1, 0.32, 1) both",
        shimmer: "shimmer 2.2s linear infinite",
        "pulse-dot": "pulse-dot 2.4s ease-in-out infinite",
        "chat-pop": "chat-pop 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      },
    },
  },
  plugins: [],
};
