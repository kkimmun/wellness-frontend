// (기존 코드 하단에 추가할 내용만 덮어쓰지 않기 위해 전체 코드를 다시 작성)
import styled from "styled-components";
import { theme } from "../../styles/theme";

export const HeaderContainer = styled.header`
  position: fixed;
  left: 0;
  top: 0;
  width: 96px;
  height: 100vh;
  background-color: ${theme.colors.bgWhite || "#ffffff"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.lg} 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  z-index: 10000;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    width: 100%;
    height: 56px !important;
    min-height: 56px;
    max-height: 56px;
    flex-direction: row;
    padding: 0 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

export const LogoArea = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 72px;
    height: auto;
  }
`;

export const DesktopNavList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const NavItem = styled.li`
  font-size: ${theme.fontSize.md};
  cursor: pointer;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  color: ${({ $active }) =>
    $active ? theme.colors.textPrimary : theme.colors.textMuted};
  font-weight: ${({ $active }) => ($active ? "700" : "400")};
  transition: color 0.15s ease;

  &:hover {
    color: ${theme.colors.textPrimary};
  }
`;

export const UserIconWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DesktopUserIconArea = styled.div`
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: color 0.15s ease;

  &:hover {
    color: ${theme.colors.textPrimary};
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const HeaderProfileImg = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #E2E8F0;

  @media (max-width: 1024px) {
    width: 24px;
    height: 24px;
  }
`;

export const PopoverWrapper = styled.div`
  position: absolute;
  bottom: 0; /* 데스크톱: 아이콘이 최하단에 있으므로 위쪽으로 솟아오르도록 설정 */
  left: 60px; /* 사이드바 바깥 우측으로 팝업 */
  z-index: 10001;

  @media (max-width: 1024px) {
    top: 36px;
    bottom: auto; /* 모바일: 상단 헤더 아래로 떨어지도록 설정 */
    left: auto;
    right: 0; 
  }
`;

export const MobileRightGroup = styled.div`
  display: none;

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
  }
`;

export const UserIconArea = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const MobileMenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textPrimary};
`;

export const MobileDrawer = styled.div`
  display: none;

  @media (max-width: 1024px) {
    display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
    flex-direction: column;
    position: fixed;
    top: 56px;
    left: 0;
    width: 100vw;
    height: auto;
    max-height: 70vh;
    background-color: #ffffff !important;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
    border-bottom-left-radius: ${theme.radius.lg || "16px"};
    border-bottom-right-radius: ${theme.radius.lg || "16px"};
    padding: ${theme.spacing.lg} 20px ${theme.spacing.xl};
    box-sizing: border-box;
    z-index: 9999;
    overflow-y: auto;
  }
`;

export const MobileNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  width: 100%;
`;

export const MobileNavItem = styled.li`
  font-size: ${theme.fontSize.lg};
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  color: ${({ $active, $isLogout }) =>
    $isLogout ? theme.colors.error : $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  cursor: pointer;
`;

export const SearchContainer = styled.div`
  position: absolute;
  z-index: 100;
`;
