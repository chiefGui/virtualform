/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      scale: {
        200: '2',
      },

      colors: {
        gray: {
          DEFAULT: '#585858',
          50: '#F9F9F9',
          100: '#E7E7E7',
          200: '#C3C3C3',
          300: '#9F9F9F',
          400: '#7C7C7C',
          500: '#585858',
          600: '#464646',
          700: '#343434',
          800: '#222222',
          900: '#111111',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
