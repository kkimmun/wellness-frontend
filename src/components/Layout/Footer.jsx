import { useNavigate } from "react-router-dom";
import {
  FooterContainer,
  FooterNav,
  FooterNavItem,
  CopyrightText,
} from "./Footer.styles";

import { useAuth } from "../../context/AuthContext";

const FOOTER_MENUS = [
  { id: "map", label: "지도", path: "/map" },
  { id: "gimpoTop10", label: "TOP 10", path: "/gimpoTop10" },
  { id: "plan", label: "계획모드", path: "/map?mode=j", requiresAuth: true },
  { id: "recommend", label: "추천모드", path: "/map?mode=p", requiresAuth: true },
  { id: "pilgrim", label: "순례길 목록", path: "/pilgrim/fixed" },
];

function Footer() {
  const navigate = useNavigate();
  const { status } = useAuth();
  const isLoggedIn = status === "authenticated";

  const handleMenuClick = (menu) => {
    if (menu.requiresAuth && !isLoggedIn) {
      navigate("/login");
      return;
    }

    if (menu.id === "plan") {
      navigate("/map?mode=j", { state: { planView: "saved" } });
      return;
    }

    if (menu.id === "map") {
      navigate("/map", { state: { hideInitialTop10: true, resetMapView: true } });
      return;
    }

    navigate(menu.path);
  };

  return (
    <FooterContainer>
      <FooterNav>
        {FOOTER_MENUS.map((menu) => (
          <FooterNavItem key={menu.id} onClick={() => handleMenuClick(menu)}>
            <span>{menu.label}</span>
          </FooterNavItem>
        ))}
      </FooterNav>
      <CopyrightText>
        Design with love &copy; 웰니스와 깃커밋 2026.08.19. All rights reserved.
      </CopyrightText>
    </FooterContainer>
  );
}

export default Footer;
