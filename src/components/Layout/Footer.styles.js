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

  @media (max-width: 768px) {
    padding: 32px 16px 20px;
  }
`;

export const FooterNav = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 280px;
    gap: 12px 16px;
    justify-content: center;
  }
`;

export const FooterNavItem = styled.li`
  color: ${theme.colors.white};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: -0.02em;
  text-align: center;

  /* 메인 텍스트 hover 투명도 적용 */
  & > span {
    transition: opacity 0.15s ease, color 0.15s ease;
  }

  &:hover > span {
    opacity: 0.8;
    color: ${theme.colors.primaryLight || "#a5d6a7"};
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const CopyrightText = styled.p`
  margin-top: 28px;
  color: rgba(255, 255, 255, 0.75);
  font-size: ${theme.fontSize.xs}; /* 11px */
  text-align: center;
  letter-spacing: 0.02em;
  line-height: 1.6;
  word-break: keep-all;

  @media (max-width: 768px) {
    margin-top: 20px;
    font-size: 11px;
    padding: 0 10px;
  }
`;
