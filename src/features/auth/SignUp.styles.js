import styled from "styled-components";
import { theme } from "../../styles/theme";

export const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* 헤더/푸터를 제외한 본문 영역 높이 확보 (상황에 맞게 조절 가능) */
  min-height: calc(100vh - 160px);
  background-color: ${theme.colors.bgLight};
  padding: ${theme.spacing.xxl} ${theme.spacing.md};
`;

export const Card = styled.div`
  background-color: ${theme.colors.bgWhite};
  width: 100%;
  max-width: 520px; /* 2열 배치를 위해 기존 AuthCard보다 넓게 설정 */
  padding: ${theme.spacing.xxl};
  border-radius: ${theme.radius.lg};
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xs};
`;

export const Title = styled.h2`
  font-size: ${theme.fontSize.xl};
  color: ${theme.colors.textPrimary};
  margin: 0;
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

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg} ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};

  /* 모바일에서는 1열로 세로 배치 */
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};

  label {
    font-size: ${theme.fontSize.sm};
    font-weight: 500;
    color: ${theme.colors.textSecondary};
  }
`;

export const ErrorMessage = styled.span`
  color: ${theme.colors.error || "#ff4d4f"};
  font-size: ${theme.fontSize.xs || "12px"};
  margin-top: 4px;
  margin-left: 4px;
`;
