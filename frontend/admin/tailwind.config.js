/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7ed',
          100: '#dcefd5',
          500: '#449534',
          700: '#285e21',
          800: '#224b1d',
          900: '#1e4019',
          950: '#0c2109',
        },
        gold: {
          400: '#e4b13b',
          500: '#d4951e',
          600: '#ba7516',
        },
        cream: '#F9F5EF',
      },
    },
  },
  plugins: [],
}
