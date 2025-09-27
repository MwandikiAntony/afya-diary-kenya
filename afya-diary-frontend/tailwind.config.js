/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hospitalBlue: "#0077b6",
        hospitalGreen: "#38b000",
        hospitalGray: "#f1f5f9",
      },
    },
  },
  plugins: [],
}
