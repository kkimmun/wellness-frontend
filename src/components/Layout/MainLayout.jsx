import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { LayoutWrapper, ContentArea, MainContent } from "./MainLayout.styles";

function MainLayout() {
  return (
    <LayoutWrapper>
      {/* 좌측 고정 네비게이션 헤더 */}
      <Header />

      {/* 우측 본문 콘텐츠 */}
      <ContentArea>
        <MainContent>
          <Outlet />
        </MainContent>
      </ContentArea>
    </LayoutWrapper>
  );
}

export default MainLayout;
