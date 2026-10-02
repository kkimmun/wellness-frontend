import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AdminWrapper, AdminContent } from "./AdminLayout.styles";

const ADMIN_MENU = [
  { label: "명소 관리", path: "/admin/places" },
  { label: "순례자길 관리", path: "/admin/courses" },
];

function AdminLayout() {
  return (
    <AdminWrapper>
      <Sidebar
        title="Wellness CMS"
        items={ADMIN_MENU}
        footerItem={{ label: "메인으로 돌아가기", path: "/" }}
      />
      <AdminContent>
        <Outlet />
      </AdminContent>
    </AdminWrapper>
  );
}

export default AdminLayout;
