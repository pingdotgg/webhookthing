/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [require("@captain/tailwind-config")],

  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 1.5s ease-out",
      },
    },
  },
};
