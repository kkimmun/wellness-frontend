import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContextValue";
import { isAdminRole } from "../../utils/jwt";

export const PublicRoute = () => {
  const { status } = useAuth();

  if (status === "loading") return <div>로딩중...</div>;

  return status === "authenticated" ? <Navigate to="/" replace /> : <Outlet />;
};

export const PrivateRoute = () => {
  const { status } = useAuth();

  if (status === "loading") return <div>로딩중...</div>;

  return status === "authenticated" ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
  const { status, role } = useAuth();

  if (status === "loading") return <div>로딩중...</div>;
  if (status !== "authenticated") return <Navigate to="/login" replace />;

  return isAdminRole(role) ? <Outlet /> : <Navigate to="/" replace />;
};
