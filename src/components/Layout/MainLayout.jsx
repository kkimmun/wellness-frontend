import { Outlet } from "react-router-dom";
import Header from "./Header";
import { LayoutWrapper, ContentArea, MainContent } from "./MainLayout.styles";

function MainLayout() {
  return (
    <LayoutWrapper>
      <Header />

      <ContentArea>
        <MainContent>
          <Outlet />
        </MainContent>
      </ContentArea>
    </LayoutWrapper>
  );
}

export default MainLayout;
