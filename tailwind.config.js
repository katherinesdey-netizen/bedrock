/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        taupe: {
          50:  '#faf8f5',
          100: '#f2ede6',
          200: '#e5ddd3',
          300: '#d4c9bc',
          400: '#b8a898',
          500: '#9d8c7a',
          600: '#7d6e5e',
        },
        sage: {
          50:  '#f3f6f1',
          100: '#e4ece1',
          200: '#c7d9c2',
          300: '#a3c09b',
          400: '#7aa370',
          500: '#5d8754',
          600: '#4a6e42',
          700: '#3a5733',
          800: '#2b4126',
        },
      },
    },
  },
  plugins: [],
};
