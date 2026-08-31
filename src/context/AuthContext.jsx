import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthAPI } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    status: "loading", // "loading" | "authenticated" | "unauthenticated"
    user: null,
  });

  const checkAuth = async () => {
    try {
      const response = await AuthAPI.getMe();
      setAuthState({
        status: "authenticated",
        user: response.data || response, // 응답 구조에 맞게 조정
      });
    } catch (error) {
      setAuthState({
        status: "unauthenticated",
        user: null,
      });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
