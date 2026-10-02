import styled from "styled-components";
import { theme } from "../../styles/theme";

export const BaseInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textPrimary};
  background-color: ${theme.colors.bgWhite};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.lg};
  outline: none;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: ${theme.colors.textMuted};
  }

  &:focus {
    border-color: ${theme.colors.primary};
  }

  &:disabled,
  &[readOnly] {
    background-color: ${theme.colors.bgLight};
    color: ${theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;

  
  svg {
    position: absolute;
    right: ${theme.spacing.md};
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.colors.textMuted};
  }
`;

export const BaseTextarea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textPrimary};
  background-color: ${theme.colors.bgWhite};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  outline: none;
  resize: vertical; 
  min-height: 100px;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: ${theme.colors.textMuted};
  }

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

export const ErrorMessage = styled.span`
  display: block;
  margin-top: ${theme.spacing.xs};
  color: ${theme.colors.error};
  font-size: ${theme.fontSize.xs};
  margin-left: 4px;
`;
