const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: { mode: "all", content: ["./src/**/*.svelte", "./src/**/*.html"] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      // TODO https://github.com/google/fonts/issues/2688
      // sans: ["Raleway", ...defaultTheme.fontFamily.sans],
      serif: ["Playfair Display", ...defaultTheme.fontFamily.serif],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
