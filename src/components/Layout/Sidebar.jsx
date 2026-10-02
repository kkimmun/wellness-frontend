import { useNavigate, useLocation } from "react-router-dom";
import {
  SidebarContainer,
  SidebarTitle,
  SidebarNav,
  SidebarLink,
  SidebarFooter,
} from "./Sidebar.styles";

const Sidebar = ({ title, items = [], footerItem }) => {
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
      {footerItem && (
        <SidebarFooter>
          <SidebarLink type="button" onClick={() => navigate(footerItem.path)}>
            {footerItem.label}
          </SidebarLink>
        </SidebarFooter>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;
