const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  content: ["./pages/**/*.jsx", "./components/**/*.jsx"],
  plugins: [require("@tailwindcss/forms")],
};
