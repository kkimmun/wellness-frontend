import styled from "styled-components";
import { theme } from "../../styles/theme";

export const PaginationNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.md} 0;
`;

export const PageButton = styled.button`
  min-width: 32px;
  height: 32px;
  padding: 0 ${theme.spacing.sm};
  font-size: ${theme.fontSize.sm};
  color: ${({ $active }) =>
    $active ? theme.colors.white : theme.colors.textSecondary};
  background-color: ${({ $active }) =>
    $active ? theme.colors.primary : theme.colors.bgWhite};
  border: 1px solid
    ${({ $active }) =>
      $active ? theme.colors.primary : theme.colors.borderLight};
  border-radius: ${theme.radius.sm};
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    border-color: ${theme.colors.primary};
    color: ${({ $active }) =>
      $active ? theme.colors.white : theme.colors.primary};
  }

  &:disabled {
    color: ${theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

export const Ellipsis = styled.span`
  min-width: 24px;
  text-align: center;
  color: ${theme.colors.textMuted};
  font-size: ${theme.fontSize.sm};
`;
