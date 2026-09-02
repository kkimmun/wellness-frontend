import styled from "styled-components";
import { theme } from "../../styles/theme";

export const AdminWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
  background-color: ${theme.colors.bgWhite};
`;

export const AdminContent = styled.main`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: ${theme.spacing.xl};
  box-sizing: border-box;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
  }
`;
