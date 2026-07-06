/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7ed',
          100: '#dcefd5',
          200: '#b9dfab',
          300: '#8ec87a',
          400: '#65b052',
          500: '#449534',
          600: '#337828',
          700: '#285e21',
          800: '#224b1d',
          900: '#1e4019',
          950: '#0c2109',
        },
        gold: {
          50:  '#fdf9ee',
          100: '#f9f0d0',
          200: '#f2de9d',
          300: '#eac764',
          400: '#e4b13b',
          500: '#d4951e',
          600: '#ba7516',
          700: '#9a5515',
          800: '#7d4318',
          900: '#693818',
          950: '#3c1c09',
        },
        cream: '#F9F5EF',
        charcoal: '#1A1A1A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
