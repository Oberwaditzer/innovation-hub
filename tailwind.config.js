module.exports = {
   content: ['./pages/**/*.{js,ts,jsx,tsx}', './frontend/**/*.{js,ts,jsx,tsx}'],
   theme: {
      extend: {
         transitionProperty: {
            width: 'width',
            'max-width': 'max-width',
            'max-height': 'max-height',
            spacing: 'margin, padding',
         },
         spacing: {
            128: '32rem',
         },
         maxWidth: {
            '1/2': '50%',
         },
      },
   },
   plugins: [],
   important: true
};
