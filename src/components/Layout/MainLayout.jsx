import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { LayoutWrapper, ContentArea, MainContent } from "./MainLayout.styles";

function MainLayout() {
  const location = useLocation();

  // 메인 지도 뷰('/') 또는 '/map'에서는 세로 스크롤 및 푸터 숨김
  const isMapPage = location.pathname === "/" || location.pathname === "/map";

  return (
    <LayoutWrapper>
      {/* 좌측 고정 네비게이션 헤더 */}
      <Header />

      {/* 우측 본문 콘텐츠 + 푸터 */}
      <ContentArea $isMapPage={isMapPage}>
        <MainContent $isMapPage={isMapPage}>
          <Outlet />
        </MainContent>
        {!isMapPage && <Footer />}
      </ContentArea>
    </LayoutWrapper>
  );
}

export default MainLayout;
