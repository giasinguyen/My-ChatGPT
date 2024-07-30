/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primaryBg: {
          default: '#131314',
          sideBar: '#1e1f20'
        }
      }
    },
  },
  plugins: [],
}

