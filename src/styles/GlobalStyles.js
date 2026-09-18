

import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";

const GlobalStyles = createGlobalStyle`
  
  *, *::before, *::after {
    box-sizing: border-box;
  }

  
  html {
    margin: 0;
    padding: 0;
    height: 100%;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%;
    overflow-x: hidden;
    -webkit-tap-highlight-color: transparent;
    font-family: ${theme.fontFamily.base};
    line-height: ${theme.lineHeight.normal};
    color: ${theme.colors.textPrimary};
    background-color: ${theme.colors.bgWhite};
  }

  #root {
    margin: 0;
    padding: 0;
    height: 100%;
  }


  
  input, button, textarea, select {
    font: inherit;
  }

  
  a {
    color: inherit;
    text-decoration: none;
  }
  ul,
  ol {
  list-style: none;
  margin: 0;
  padding: 0;
}


  
 button {
  background: none;
  border: none;
}

button:not(:disabled) {
  cursor: pointer;
}
`;

export default GlobalStyles;
