import styled from "styled-components";
import { theme } from "../../styles/theme";

export const SidebarContainer = styled.aside`
  width: 220px;
  flex-shrink: 0;
  height: 100%;
  background-color: ${theme.colors.bgWhite};
  border-right: 1px solid ${theme.colors.borderLight};
  padding: ${theme.spacing.lg} 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  box-sizing: border-box;

  @media (max-width: ${theme.breakpoints.md}) {
    width: 160px;
  }
`;

export const SidebarTitle = styled.h1`
  margin: 0;
  padding: 0 ${theme.spacing.lg};
  font-size: ${theme.fontSize.lg};
  font-weight: 700;
  color: ${theme.colors.primary};
`;

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
`;

export const SidebarLink = styled.button`
  width: 100%;
  text-align: left;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: ${theme.fontSize.md};
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  color: ${({ $active }) =>
    $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  border-left: 3px solid
    ${({ $active }) => ($active ? theme.colors.primary : "transparent")};
  background-color: ${({ $active }) =>
    $active ? theme.colors.bgLight : "transparent"};
  transition: all 0.15s ease;

  &:hover {
    background-color: ${theme.colors.bgLight};
    color: ${theme.colors.textPrimary};
  }
`;
