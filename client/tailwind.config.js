/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff8f4',
          100: '#ffecdd',
          200: '#ffd4b8',
          300: '#ffb380',
          400: '#f7933e',
          500: '#f58220',
          600: '#e06d10',
          700: '#bc5a0e',
          800: '#994a0f',
          900: '#7c3e10',
        },
        medical: {
          teal: '#14b8a6',
        },
      },
      fontFamily: {
        sans:    ['Inter',  'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
