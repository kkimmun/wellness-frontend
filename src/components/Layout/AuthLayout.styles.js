import styled from "styled-components";
import { theme } from "../../styles/theme";

export const AuthLayoutWrapper = styled.div`
  width: 100vw;
  height: 100vh; /* 화면 전체 높이 고정 */
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.bgLight};
  overflow: hidden; /* 전체 화면 바깥 스크롤 방지 */
`;

export const AuthContent = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  overflow-y: auto; /* 화면 높이가 좁아질 때만 본문 내부 스크롤 허용 */
`;
