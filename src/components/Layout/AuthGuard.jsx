import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
