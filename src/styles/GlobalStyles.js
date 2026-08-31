// src/styles/GlobalStyles.js

/**
 * 프로젝트 전체에 적용되는 전역 CSS를 관리하는 파일
 *
 * [사용 목적]
 * - 브라우저의 기본 스타일을 초기화
 * - 모든 페이지에서 공통으로 적용되어야 하는 기본 스타일 설정
 * - body, form, link, list, button 등의 기본 스타일 통일
 *
 * [사용 방법]
 * - 모든 화면에서 공통적으로 적용되어야 하는 스타일만 작성
 * - 특정 페이지나 특정 컴포넌트의 스타일은 이 파일에 작성하지 않음
 * - 디자인 값은 가능한 한 theme.js의 값을 사용
 *
 * [theme과의 역할 구분]
 * - theme.js       → 디자인 규격을 정의
 * - GlobalStyles.js → 전역 기본 스타일을 적용
 *
 * 예:
 * theme.spacing.md
 * → "16px이라는 디자인 규격"
 *
 * GlobalStyles
 * → body의 기본 폰트, box-sizing, 기본 여백 등을 전역 적용
 *
 * [주의]
 * - 특정 컴포넌트에서만 필요한 스타일은 해당 컴포넌트의 styled-component에서 작성
 * - GlobalStyles에 컴포넌트 전용 스타일을 계속 추가하지 않음
 */

import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";

const GlobalStyles = createGlobalStyle`
  /* 1. 모든 요소 박스 사이징 통일 */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  /* 1-2. React 루트 및 바디 여백 초기화 */
  html,
  body,
  #root {
    margin: 0;
    padding: 0;
  }

  /* 2. 바디 기본 세팅 */
body {
  font-family: ${theme.fontFamily.base};
  line-height: ${theme.lineHeight.normal};
  color: ${theme.colors.textPrimary};
  background-color: ${theme.colors.bgWhite};
}


  /* 3. 폼 요소 폰트 상속 및 기본 스타일 초기화 */
  input, button, textarea, select {
    font: inherit;
  }

  /* 4. 링크 및 리스트 기본 서식 제거 */
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


  /* 5. 버튼 기본 아웃라인 및 배경 제거 편의성 */
 button {
  background: none;
  border: none;
}

button:not(:disabled) {
  cursor: pointer;
}
`;

export default GlobalStyles;
