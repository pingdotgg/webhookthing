/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@captain/tailwind-config")],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("@tailwindcss/forms")],
};
