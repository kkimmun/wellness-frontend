import styled from "styled-components";
import { theme } from "../../styles/theme"; // 👈 프로젝트 경로에 맞게 theme 임포트 경로 확인해주세요!

export const LayoutWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden; /* 전체 뷰포트 스크롤 방지 */
  background-color: ${theme.colors.bgWhite};

  /* 1024px 이하 태블릿/모바일: 세로 배치 */
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const ContentArea = styled.div`
  margin-left: 96px; /* 데스크톱: 좌측 Header 너비(96px)만큼 여백 확보 */
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* 내용 초과 시 스크롤 허용 (기존 hidden에서 변경) */

  /* 1024px 이하: 좌측 마진 제거 및 상단 모바일 Header 높이(56px)만큼 여백 확보 */
  @media (max-width: 1024px) {
    margin-left: 0;
    margin-top: 56px;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  width: 100%;
  position: relative;
`;
