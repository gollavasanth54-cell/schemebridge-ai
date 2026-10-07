/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff', 100: '#d9ebff', 200: '#bcdcff', 300: '#8ec6ff',
          400: '#59a6ff', 500: '#3285fb', 600: '#1d67ef', 700: '#1651db',
          800: '#1842b1', 900: '#193b8b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}