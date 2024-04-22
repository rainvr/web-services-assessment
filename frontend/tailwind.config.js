/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'landscape-background': "url(../src/common/images/bg-landscape-gym.jpg)",
        'portrait-background': "url('../src/common/images/bg-portrait-gym.jpg')",
      }
    },
  },
  plugins: [require("daisyui")],
}

