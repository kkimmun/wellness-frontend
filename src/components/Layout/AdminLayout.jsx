import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AdminWrapper, AdminContent } from "./AdminLayout.styles";

// 관리자 사이드바 메뉴
// 명소 관리 외 항목은 화면설계서 확정 후 추가한다.
const ADMIN_MENU = [{ label: "명소 관리", path: "/admin/places" }];

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
