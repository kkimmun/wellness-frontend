import styled from "styled-components";
import { theme } from "../../styles/theme";

export const AuthCardWrapper = styled.div`
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.bgWhite};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.lg};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  /* 모바일 대응 여백 축소 */
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
    border: none;
    box-shadow: none;
  }
`;
