/** @type {import('tailwindcss').Config} */
export default {
  content: ["./views/**/*.ejs", "./assets/js/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")]
}

