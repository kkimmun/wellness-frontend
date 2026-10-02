import styled from "styled-components";
import { theme } from "../../styles/theme";

export const AuthLayoutWrapper = styled.div`
  width: 100vw;
  height: 100vh; 
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.bgLight};
  overflow: hidden; 
`;

export const AuthContent = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  overflow-y: auto; 
`;
