module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./frontend/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    maxWidth: {
      '1/2' : '50%'
    },
    extend: {
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding'
      },
      spacing: {
        '128': '32rem'
      }
    },
  },
  plugins: [],
}