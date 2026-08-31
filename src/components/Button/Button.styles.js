import styled, { css } from "styled-components";
import { theme } from "../../styles/theme";

const SIZES = {
  sm: css`
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.fontSize.sm};
    border-radius: ${theme.radius.sm};
  `,
  md: css`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSize.md};
    border-radius: ${theme.radius.md};
  `,
  lg: css`
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fontSize.lg};
    border-radius: ${theme.radius.md};
  `,
};

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  transition: background-color 0.2s ease;

  ${({ $size }) => SIZES[$size || "md"]}

  &:hover:not(:disabled) {
    background-color: ${theme.colors.primaryHover};
  }

  &:disabled {
    background-color: ${theme.colors.primaryDisabled};
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  background-color: ${theme.colors.bgWhite};
  color: ${theme.colors.textSecondary};
  border: 1px solid ${theme.colors.borderLight};
  transition: all 0.2s ease;

  ${({ $size }) => SIZES[$size || "md"]}

  &:hover:not(:disabled) {
    background-color: ${theme.colors.bgLight};
    color: ${theme.colors.textPrimary};
  }
`;

export const PillButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: ${theme.fontSize.sm};
  font-weight: 500;
  border-radius: ${theme.radius.pill};
  transition: opacity 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.85;
  }
`;

export const TableActionButton = styled.button`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textPrimary};
  background-color: ${theme.colors.bgWhite};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.sm};
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${theme.colors.bgLight};
  }
`;
