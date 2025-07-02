/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        landingBg: "url('/static/landingBg.jpg')",
        reviewBg: "url('/static/landingBg.jpg')",
        loginBg: "url('/static/loginBg.jpg')",
      },
    },
  },
  plugins: [],
};
