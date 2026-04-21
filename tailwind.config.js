/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        linen: {
          50: '#f9f8f6',
          100: '#f3f0eb',
          200: '#e6e2db',
          300: '#d7d0c5',
          800: '#4a443f',
          900: '#2c2825',
        },
      }
    },
  },
  plugins: [],
}
