import styled from "styled-components";
import { theme } from "../../styles/theme"; // 명세서 4.2 기준 직접 import

export const FooterContainer = styled.footer`
  width: 100%;
  background-color: ${theme.colors.textMuted};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px ${theme.spacing.lg}; /* 48px 20px 24px */
  box-sizing: border-box;
`;

export const FooterNav = styled.ul`
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 서브메뉴가 펼쳐질 때 상단 기준 고정 */
  gap: 48px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;

  /* 💡 핵심: 서브메뉴 높이만큼 미리 여유 공간 확보 (덜컹거림 완벽 방지) */
  min-height: 90px;

  @media (max-width: 640px) {
    gap: ${theme.spacing.lg};
    min-height: 80px; /* 모바일은 폰트가 작으니 공간을 살짝 줄임 */
  }
`;

export const FooterSubMenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm}; /* 8px */
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition:
    max-height 0.3s ease-in-out,
    opacity 0.25s ease-in-out,
    margin-top 0.3s ease;
`;

export const FooterSubMenuItem = styled.li`
  font-size: ${theme.fontSize.md}; /* 14px */
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  cursor: pointer;
  transition: color 0.15s ease;
  white-space: nowrap;

  &:hover {
    color: ${theme.colors.textSecondary};
    font-weight: 600;
  }

  &::before {
    content: "- ";
    color: rgba(255, 255, 255, 0.6);
  }

  @media (max-width: 640px) {
    font-size: ${theme.fontSize.sm}; /* 12px */
  }
`;

export const FooterNavItem = styled.li`
  color: ${theme.colors.white};
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: -0.02em;
  text-align: center;

  /* 메인 텍스트에만 hover 투명도 적용 */
  & > span {
    transition: opacity 0.15s ease;
  }

  &:hover > span {
    opacity: 0.6;
  }

  /* 호버 시 하위 서브메뉴 슬라이드 다운 */
  &:hover ${FooterSubMenuList} {
    max-height: 100px;
    opacity: 1;
    margin-top: 12px;
  }

  @media (max-width: 640px) {
    font-size: ${theme.fontSize.lg}; /* 16px */
  }
`;

export const CopyrightText = styled.p`
  margin-top: 32px;
  color: rgba(255, 255, 255, 0.85);
  font-size: ${theme.fontSize.xs}; /* 11px */
  text-align: center;
  letter-spacing: 0.02em;
`;
