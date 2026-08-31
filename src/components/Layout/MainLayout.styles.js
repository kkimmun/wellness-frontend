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
  /* 지도 뷰일 때는 내부 스크롤을 막고, 일반 페이지일 때만 세로 스크롤 허용 */
  overflow-y: ${({ $isMapPage }) => ($isMapPage ? "hidden" : "auto")};

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

  /* 일반 텍스트/게시판/상세 페이지일 때 최대 너비 제한 및 중앙 정렬 */
  ${({ $isMapPage }) =>
    !$isMapPage &&
    `
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 24px;
    box-sizing: border-box;
  `}
`;
