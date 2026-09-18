/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0e1a",
        card: "#151a2c",
        card2: "#1b2138",
        cardline: "#262c42",
        cardline2: "#33395a",
        ink: "#f5f3ee",
        text2: "#c7c9d9",
        text3: "#9da1b5",
        text4: "#8b90a3",
        accent: "#ff8a34",
        accentText: "#ffa35c",
        good: "#2fd3a0",
        goodText: "#34d399",
        bad: "#ff6b6b",
        badText: "#ff6b6b",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "-apple-system", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
