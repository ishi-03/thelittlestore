/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },

      colors: {
        pink: {
          DEFAULT: '#f4a7b9',
          light: '#fde8ee',
          medium: '#f9c6d3',
          dark: '#c05f7a',
        },

        cream: '#fdf8f2',
        blush: '#fdf0f4',
        beige: '#f5ede0',
      },

      boxShadow: {
        soft: '0 2px 8px rgba(200,150,160,0.10)',
      },
    },
  },
  plugins: [],
}