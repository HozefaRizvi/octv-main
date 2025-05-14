export const colors = {
  white: '#ffffff',
  black: '#000000',
  gray: '#808080',
  DarkGray: '#5a5a5a',
  lightGray: '#aaaaaa',
  theme: '#16a085',
  darkRed: '#A91E2F',
  error: '#ff2f47',
  disable: '#2C2C2C',
  InActive: '#555555',
  dull: '#1B1B1B',
  share:'#C1C1C1',
  description:'#D9D9D9',
  slideInActive: '#7C7C7C',
  copied: '#008B07',
  number:'#3A3939'
};

// let _colors = {
//   white: '#ffffff',
//   black: '#000000',
//   gray: '#808080',
//   DarkGray: '#5a5a5a',
//   lightGray: '#aaaaaa',
//   theme: '#16a085',
//   darkRed: '#A91E2F',
//   error: '#ff2f47',
//   disable: '#2C2C2C',
//   InActive: '#555555',
//   dull: '#1B1B1B',
//   share: '#C1C1C1',
//   description: '#D9D9D9',
//   slideInActive: '#7C7C7C',
//   copied: '#008B07',
//   number: '#3A3939',
// };

// const backendToColorMap = {
//   theme: 'themeActiveColor',
//   dull:'bgcolor',
//   white:'themePrimaryTxtColor',
//   share:'themeSecondaryTxtColor',
//   description:'cardDesColor',
//   copied:'headerBgColor',
//   number:'navbarSearchColor',
//   InActive:'navbarSearchColor',
//   'darkRed':'footerbtmBgcolor',
//   'gray':'navbarSearchColor'

// };

// export const setColors = (website_colors = {}) => {
//   const updated = { ..._colors };

//   for (const [localKey, backendKey] of Object.entries(backendToColorMap)) {
//     if (website_colors[backendKey]) {
//       updated[localKey] = website_colors[backendKey];
//     }
//   }

//   _colors = updated;
// };

// export const colors = new Proxy({}, {
//   get: (_, prop) => _colors[prop],
// });
