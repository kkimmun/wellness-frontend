import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { AuthLayoutWrapper, AuthContent } from "./AuthLayout.styles";

export default function AuthLayout() {
  return (
    <AuthLayoutWrapper>
      <AuthContent>
        <Outlet />
      </AuthContent>
      <Footer />
    </AuthLayoutWrapper>
  );
}
