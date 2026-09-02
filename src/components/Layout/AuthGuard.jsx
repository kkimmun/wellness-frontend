import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isAdminRole } from "../../utils/jwt";

export const PublicRoute = () => {
  const { status } = useAuth();

  if (status === "loading") return <div>로딩중...</div>; // TODO: 스피너 등으로 교체 가능

  return status === "authenticated" ? <Navigate to="/" replace /> : <Outlet />;
};

export const PrivateRoute = () => {
  const { status } = useAuth();

  if (status === "loading") return <div>로딩중...</div>;

  return status === "authenticated" ? <Outlet /> : <Navigate to="/login" replace />;
};

// 관리자 전용 라우트: 인증 + accessToken payload의 관리자 권한을 함께 확인한다.
export const AdminRoute = () => {
  const { status, role } = useAuth();

  if (status === "loading") return <div>로딩중...</div>;
  if (status !== "authenticated") return <Navigate to="/login" replace />;

  return isAdminRole(role) ? <Outlet /> : <Navigate to="/" replace />;
};
