/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          body: ["var(--font-inter)"],
          subtitle: ["var(--font-poppins)"],
          title: ["var(--font-parisienne)"],
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  }
  