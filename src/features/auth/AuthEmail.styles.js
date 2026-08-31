import styled from "styled-components";
import { theme } from "../../styles/theme";

export const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 160px);
  background-color: ${theme.colors.bgLight};
  padding: ${theme.spacing.xxl} ${theme.spacing.md};
  box-sizing: border-box;
`;

export const Card = styled.div`
  background-color: ${theme.colors.bgWhite};
  width: 100%;
  max-width: 520px;
  min-height: 480px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  padding: ${theme.spacing.xxl};
  border-radius: ${theme.radius.lg};
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;

  @media (max-width: ${theme.breakpoints.sm}) {
    min-height: auto;
    padding: ${theme.spacing.lg};
  }
`;

export const CardTop = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: ${theme.spacing.xl};
`;

export const Title = styled.h2`
  font-size: ${theme.fontSize.xl};
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  box-sizing: border-box;
`;

export const InputGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  box-sizing: border-box;

  label {
    font-size: ${theme.fontSize.sm};
    font-weight: 500;
    color: ${theme.colors.textSecondary};
    line-height: 1.4;
  }

  & > * {
    width: 100% !important;
    box-sizing: border-box !important;
  }
`;

export const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  font-size: ${theme.fontSize.xs || "12px"};
`;

export const TimerText = styled.span`
  color: ${theme.colors.error || "#ff4d4f"};
  font-weight: 600;
`;

export const ResendButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textSecondary || "#666666"};
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: ${theme.fontSize.xs || "12px"};

  &:hover {
    color: ${theme.colors.textPrimary};
  }
`;

export const ErrorMessage = styled.span`
  color: ${theme.colors.error || "#ff4d4f"};
  font-size: ${theme.fontSize.xs || "12px"};
  margin-top: 4px;
  margin-left: 4px;
`;
