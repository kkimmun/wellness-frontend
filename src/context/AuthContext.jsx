import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AuthAPI } from "../api/auth";
import { getValidRole } from "../utils/jwt";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const authRequestIdRef = useRef(0);
  const [authState, setAuthState] = useState({
    status: localStorage.getItem("accessToken")
      ? "loading"
      : "unauthenticated", // "loading" | "authenticated" | "unauthenticated"
    user: null,
    role: null, // accessToken payload에서 디코딩한 권한 값
  });

  const clearAuth = useCallback(() => {
    // 진행 중인 이전 회원정보 조회가 뒤늦게 로그인 상태를 되살리지 못하게 한다.
    authRequestIdRef.current += 1;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("memberId");
    setAuthState({
      status: "unauthenticated",
      user: null,
      role: null,
    });
  }, []);

  const checkAuth = useCallback(async () => {
    const requestId = ++authRequestIdRef.current;
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      clearAuth();
      return;
    }

    try {
      const response = await AuthAPI.getMe();
      if (
        requestId !== authRequestIdRef.current ||
        !localStorage.getItem("accessToken")
      ) {
        return;
      }

      // 권한은 localStorage에 저장된 accessToken payload에서 추출 (만료 시 null)
      const role = getValidRole(localStorage.getItem("accessToken"));
      setAuthState({
        status: "authenticated",
        user: response.data || response, // 응답 구조에 맞게 조정
        role,
      });
    } catch {
      if (requestId === authRequestIdRef.current) clearAuth();
    }
  }, [clearAuth]);

  const logout = useCallback(() => {
    const logoutRequest = AuthAPI.logout();
    // 서버 응답을 기다리는 동안 프로필이 다시 열리지 않도록 즉시 비회원 처리한다.
    clearAuth();
    return logoutRequest;
  }, [clearAuth]);

  const withdraw = useCallback(async () => {
    await AuthAPI.withdraw();
    clearAuth();
  }, [clearAuth]);

  useEffect(() => {
    const initialCheckTimer = localStorage.getItem("accessToken")
      ? window.setTimeout(() => void checkAuth(), 0)
      : null;

    const handleSessionExpired = () => clearAuth();
    window.addEventListener("sessionExpired", handleSessionExpired);
    return () => {
      if (initialCheckTimer !== null) window.clearTimeout(initialCheckTimer);
      window.removeEventListener("sessionExpired", handleSessionExpired);
    };
  }, [checkAuth, clearAuth]);

  return (
    <AuthContext.Provider
      value={{ ...authState, checkAuth, clearAuth, logout, withdraw }}
    >
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
