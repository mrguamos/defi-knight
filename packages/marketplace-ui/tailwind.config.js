/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      'result-sm': `${640 + 320}px`,
      lg: '1024px',
      'result-md': `${768 + 320}px`,
      'result-xl': `${1280 + 320}px`,
      xl: '1280px',
      'result-lg': `${1024 + 320}px`,
      '2xl': '1536px',
      'result-2xl': `${1536 + 320}px`,
    },
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
