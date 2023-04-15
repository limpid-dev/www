/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.jsx", "./components/**/*.jsx"],
  plugins: [require("@tailwindcss/forms")],
};
