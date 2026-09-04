import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AdminWrapper, AdminContent } from "./AdminLayout.styles";

// 관리자 사이드바 메뉴
const ADMIN_MENU = [
  { label: "명소 관리", path: "/admin/places" },
  { label: "순례자길 관리", path: "/admin/courses" },
];

function AdminLayout() {
  return (
    <AdminWrapper>
      <Sidebar title="Wellness CMS" items={ADMIN_MENU} />
      <AdminContent>
        <Outlet />
      </AdminContent>
    </AdminWrapper>
  );
}

export default AdminLayout;
