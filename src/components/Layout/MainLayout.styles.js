import styled from "styled-components";
import { theme } from "../../styles/theme";

export const LayoutWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden; 
  background-color: ${theme.colors.bgWhite};

  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const ContentArea = styled.div`
  margin-left: 96px; 
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto; 

  
  @media (max-width: 1024px) {
    margin-left: 0;
    margin-top: 56px;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  width: 100%;
  position: relative;
`;
