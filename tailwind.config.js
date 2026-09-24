/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#fcf8f2',
          light: '#fffefb',
          dark: '#f3ece1',
        },
        gold: {
          DEFAULT: '#d4a373',
          light: '#e9edc9',
          dark: '#b08968',
          accent: '#dda15e'
        },
        earth: {
          dark: '#283618',
          text: '#3c3633',
          muted: '#8d8075'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        arabic: ['"Amiri"', 'serif'],
      },
    },
  },
  plugins: [],
}