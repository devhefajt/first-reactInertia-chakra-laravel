import { extendTheme } from '@chakra-ui/react';

const breakpoints = {
  base: "0em",         // 0px
  sm: "30em",          // 480px
  md: "48em",          // 768px
  lg: "62em",          // 992px
  xl: "80em",          // 1280px
  "2xl": "106.25em",   // 1700px
  "3xl": "120em"       // 1920px
};

const theme = extendTheme({
  colors: {
    pBlack: '#151515',
    pGreen: '#3FBA73'
  },
  styles: {
    global: {
      // styles for the `body`
      body: {
        color: '#5A585C'
      },
      h1: { color: '#151515' },
      h2: { color: '#151515' },
      h3: { color: '#151515' },
      h4: { color: '#151515' },
      h5: { color: '#151515' }
    }
  },
  breakpoints // add custom breakpoints here
});

export default theme;