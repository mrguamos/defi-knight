module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        r0: '#292929',
        r1: '#13174A',
        r2: '#104320',
        r3: '#530002',
        r4: '#581852',
      },
      fontFamily: {
        lato: ['Lato'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
