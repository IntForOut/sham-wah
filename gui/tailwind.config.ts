import type { Config } from "tailwindcss";

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Custom gold theme based on #D0C07A
        gold: {
          50: "#faf9f3",
          100: "#f4f1e0",
          200: "#e9e3c1",
          300: "#ddd49d",
          400: "#d0c07a", // Base color
          500: "#c4b05f",
          600: "#b09846",
          700: "#8f7a39",
          800: "#776433",
          900: "#65542d",
          950: "#3a2e17",
        },
        // Complementary warm brown for accents
        bronze: {
          50: "#f9f6f3",
          100: "#f0ebe3",
          200: "#e0d5c5",
          300: "#ccb9a0",
          400: "#b89b7a",
          500: "#a8845f",
          600: "#9b7153",
          700: "#815c46",
          800: "#6a4d3d",
          900: "#574133",
          950: "#2f211a",
        },
        // Elegant teal for active states (complements gold beautifully)
        sage: {
          50: "#f4f7f5",
          100: "#e3ebe6",
          200: "#c8d8ce",
          300: "#a3bdaf",
          400: "#7a9c8a",
          500: "#5d826e",
          600: "#496958",
          700: "#3c5548",
          800: "#32453b",
          900: "#2b3a32",
          950: "#16201b",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-down": "slideDown 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
