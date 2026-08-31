import styled from "styled-components";
import { theme } from "../../styles/theme";

export const LoginContainer = styled.div`
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
  align-items: stretch; /* 자식 요소 가로 꽉 채움 */
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

export const CardBottom = styled.div`
  width: 100%;
  margin-top: ${theme.spacing.md};
  box-sizing: border-box;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: ${theme.spacing.xs};
`;

export const Subtitle = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xl};

  a {
    color: ${theme.colors.textPrimary};
    font-weight: 600;
    text-decoration: underline;
    margin-left: ${theme.spacing.xs};
  }
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
  }

  /* BaseInput과 PasswordInput이 flex 하위에서 100% 너비를 갖도록 강제 */
  & > * {
    width: 100% !important;
    box-sizing: border-box !important;
  }
`;

export const ErrorMessage = styled.span`
  color: ${theme.colors.error || "#ff4d4f"};
  font-size: ${theme.fontSize.xs || "12px"};
  margin-top: 4px;
  margin-left: 4px;
`;

export const FormErrorMessage = styled.div`
  width: 100%;
  color: ${theme.colors.error || "#ff4d4f"};
  font-size: ${theme.fontSize.sm || "14px"};
  background-color: #fff1f0;
  border: 1px solid #ffccc7;
  padding: 8px 12px;
  border-radius: ${theme.radius.md || "8px"};
  margin-bottom: ${theme.spacing.sm};
  text-align: center;
  box-sizing: border-box;
`;

export const GoogleLoginButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: ${theme.colors.bgWhite};
  color: ${theme.colors.textPrimary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md || "8px"};
  font-size: ${theme.fontSize.sm};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;

  img {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background-color: ${theme.colors.bgLight};
  }
`;
