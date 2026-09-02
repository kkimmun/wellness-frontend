import { createContext, useContext, useState, useEffect } from "react";
import { AuthAPI } from "../api/auth";
import { getValidRole } from "../utils/jwt";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    status: "loading", // "loading" | "authenticated" | "unauthenticated"
    user: null,
    role: null, // accessToken payload에서 디코딩한 권한 값
  });

  const checkAuth = async () => {
    try {
      const response = await AuthAPI.getMe();
      // 권한은 localStorage에 저장된 accessToken payload에서 추출 (만료 시 null)
      const role = getValidRole(localStorage.getItem("accessToken"));
      setAuthState({
        status: "authenticated",
        user: response.data || response, // 응답 구조에 맞게 조정
        role,
      });
    } catch {
      setAuthState({
        status: "unauthenticated",
        user: null,
        role: null,
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
