import styled from "styled-components";
import { theme } from "../../styles/theme";
import { BaseInput } from "./Input.styles";

export const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledPasswordInput = styled(BaseInput)`
  padding-right: 48px; 

  
  ${({ $hasError }) =>
    $hasError &&
    `
    border-color: ${theme.colors.error};
  `}
`;

export const ToggleButton = styled.button`
  position: absolute;
  right: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xs};

  &:hover {
    color: ${theme.colors.textSecondary};
  }
`;
