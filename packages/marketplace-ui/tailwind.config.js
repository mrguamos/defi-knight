/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        r0: '#292929',
        r1: '#13174A',
        r2: '#104320',
        r3: '#530002',
        r4: '#581852',
      },
      fontFamily: {
        lato: ['Lato'],
        sans: ['Work Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
