import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// 비로그인 사용자만 접근 가능 (예: 로그인, 회원가입 화면)
// 이미 로그인된 상태라면 메인('/')으로 강제 이동
export const PublicRoute = () => {
  const { status } = useAuth();
  
  if (status === "loading") return <div>로딩중...</div>; // TODO: 스피너 등으로 교체 가능
  
  return status === "authenticated" ? <Navigate to="/" replace /> : <Outlet />;
};

// 로그인 사용자만 접근 가능 (예: 마이페이지 등)
// 비로그인 상태라면 로그인('/login') 화면으로 강제 이동
export const PrivateRoute = () => {
  const { status } = useAuth();

  if (status === "loading") return <div>로딩중...</div>;

  return status === "authenticated" ? <Outlet /> : <Navigate to="/login" replace />;
};
