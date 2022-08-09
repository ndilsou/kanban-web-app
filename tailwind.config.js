/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        "plus-jakarta-sans": ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        black: "hsl(237,100%,4%)",
        "very-dark-grey": "hsl(235,16%,15%)",
        "dark-grey": "hsl(235,12%,19%)",
        "lines-dark": "hsl(236,11%,27%)",
        "medium-grey": "hsl(216,15%,57%)",
        "lines-light": "hsl(221,69%,94%)",
        "light-grey": "hsl(220,69%,97%)",
        "main-purple": "hsl(242,48%,58%)",
        "hover-main-purple": "hsl(243,100%,82%)",
        red: "hsl(0,78%,63%)",
        "hover-red": "hsl(0,100%,80%)",
      },
      backgroundImage: {
        "dark-gradient":
          "linear-gradient(180deg, rgba(43, 44, 55, 25%) 0%, rgba(43, 44, 55, 12.5%) 100%)",
      },
      fontSize: {
        md: ["15px", { lineHeight: "19px" }],
      },
      spacing: {
        38: "9.5rem",
        75: "18.75rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
