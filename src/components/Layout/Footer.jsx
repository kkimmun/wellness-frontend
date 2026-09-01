import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FooterContainer,
  FooterNav,
  FooterNavItem,
  FooterSubMenuList,
  FooterSubMenuItem,
  CopyrightText,
} from "./Footer.styles";

const FOOTER_MENUS = [
  { id: "map", label: "지도", path: "/map" },
  {
    id: "pilgrim",
    label: "순례길",
    path: "/pilgrim",
    subMenus: [
      { id: "pilgrim-create", label: "코스 제작", path: "/pilgrim/create" },
      { id: "pilgrim-fixed", label: "고정 코스", path: "/pilgrim/fixed" },
    ],
  },
  { id: "gimpoTop10", label: "김포 Top10", path: "/gimpoTop10" },
];

function Footer() {
  const navigate = useNavigate();

  // 하위 메뉴 클릭 시 이벤트 버블링(상위 메뉴 클릭 이벤트) 방지
  const handleSubMenuClick = (e, path) => {
    e.stopPropagation();
    navigate(path);
  };

  return (
    <FooterContainer>
      <FooterNav>
        {FOOTER_MENUS.map((menu) => (
          <FooterNavItem key={menu.id} onClick={() => navigate(menu.path)}>
            <span>{menu.label}</span>

            {/* 서브메뉴가 존재하는 경우 렌더링 */}
            {menu.subMenus && (
              <FooterSubMenuList>
                {menu.subMenus.map((subMenu) => (
                  <FooterSubMenuItem
                    key={subMenu.id}
                    onClick={(e) => handleSubMenuClick(e, subMenu.path)}
                  >
                    {subMenu.label}
                  </FooterSubMenuItem>
                ))}
              </FooterSubMenuList>
            )}
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
