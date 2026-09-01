
/**
 * 프로젝트 전역 디자인 규격을 관리하는 파일
 *
 * [사용 목적]
 * - 프로젝트에서 반복적으로 사용하는 색상, 폰트, 여백 등의 값을 한곳에서 관리
 * - 동일한 디자인 값을 여러 컴포넌트에서 재사용하여 UI 규격을 통일
 * - 디자인 변경 시 이 파일의 값을 수정하여 전체적으로 반영하기 위함
 *
 * [사용 방법]
 * - 새로운 컴포넌트에서 디자인 값이 필요할 경우 theme의 기존 값을 우선 사용
 * - 동일한 값이 여러 곳에서 반복해서 사용될 경우 theme에 추가하는 것을 고려
 * - 특정 컴포넌트에서만 사용하는 일회성 값은 theme에 무리하게 추가하지 않음
 *
 * [주의]
 * - theme은 "디자인 규격"을 관리하는 곳
 * - 전역 CSS 초기화나 HTML 요소의 기본 스타일은 GlobalStyles에서 관리
 */

export const theme = {
  colors: {
    // Brand & Primary
    primary: "#87CEEB", // 메인 하늘색 (버튼, 하단 푸터, 포커스 라인 등)
    primaryHover: "#6BBBDD", // 메인 버튼 호버
    primaryDisabled: "#D6EEF8", // 버튼 비활성화
    gimpoGold: "#C9A227", // 김포 황금색 (포인트 컬러)

    // Grayscale & Text
    textPrimary: "#222222", // 기본 본문, 제목
    textSecondary: "#666666", // 서브 설명, 보조 텍스트
    textMuted: "#c3d1d6", // 플레이스홀더, 비활성 텍스트
    white: "#FFFFFF",
    black: "#000000",

    // Background & Surface
    bgWhite: "#FFFFFF", // 기본 배경, 카드/모달 본체
    bgLight: "#F8F9FA", // 카테고리 배지 배경, 테이블/리스트 호버
    bgDim: "rgba(0, 0, 0, 0.4)", // 모달 배경 딤(Dim)

    // Border & Line
    borderLight: "#E5E5EA", // 기본 인풋 및 카드 테두리
    borderDivider: "#EEEEEE", // 테이블/리스트 구분선

    // Status & Accent
    error: "#FF5C5C", // 유효성 에러 텍스트/보더
    success: "#34C759", // 활성 상태 배지
    warning: "#FFEA00", // 별점(StarRating) 포인트 컬러
    tagBg: "#F1F3F5", // 해시태그 칩 배경
    tagText: "#495057", // 해시태그 칩 텍스트
  },

  // 테두리 둥글기 (Border Radius)
  radius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    pill: "9999px",
  },

  // 폰트 크기 규격
  fontSize: {
    xs: "11px",
    sm: "12px",
    md: "14px",
    lg: "16px",
    xl: "20px",
  },

  // 폰트 테마
  fontFamily: {
    base: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
  },

  lineHeight: {
    normal: 1.5,
  },

  // 여백 규격
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "40px",
  },

  // 화면 규격(반응형)
  breakpoints: {
    sm: "768px",
    md: "1024px",
    lg: "1440px",
  },
};
