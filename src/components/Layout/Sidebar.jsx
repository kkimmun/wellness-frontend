import { useNavigate, useLocation } from "react-router-dom";
import {
  SidebarContainer,
  SidebarTitle,
  SidebarNav,
  SidebarLink,
} from "./Sidebar.styles";

/**
 * 좌측 고정 네비게이션 사이드바
 *
 * Props
 * - title: 상단 타이틀 (선택)
 * - items: [{ label, path }] 메뉴 목록
 */
const Sidebar = ({ title, items = [] }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <SidebarContainer>
      {title && <SidebarTitle>{title}</SidebarTitle>}
      <SidebarNav>
        {items.map((item) => (
          <SidebarLink
            key={item.path}
            type="button"
            $active={pathname === item.path || pathname.startsWith(`${item.path}/`)}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </SidebarLink>
        ))}
      </SidebarNav>
    </SidebarContainer>
  );
};

export default Sidebar;
