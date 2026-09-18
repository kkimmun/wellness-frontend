import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AuthAPI } from "../api/auth";
import { getValidRole } from "../utils/jwt";
import { AuthContext } from "./authContextValue";

export const AuthProvider = ({ children }) => {
  const authRequestIdRef = useRef(0);
  const [authState, setAuthState] = useState({
    status: localStorage.getItem("accessToken")
      ? "loading"
      : "unauthenticated",
    user: null,
    role: null,
  });

  const clearAuth = useCallback(() => {
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

      const role = getValidRole(localStorage.getItem("accessToken"));
      setAuthState({
        status: "authenticated",
        user: response.data || response,
        role,
      });
    } catch {
      if (requestId === authRequestIdRef.current) clearAuth();
    }
  }, [clearAuth]);

  const logout = useCallback(() => {
    const logoutRequest = AuthAPI.logout();
    clearAuth();
    return logoutRequest;
  }, [clearAuth]);

  const applyProfile = useCallback((profile) => {
    if (profile?.memberNo == null) return;
    authRequestIdRef.current += 1;
    setAuthState((current) => {
      if (current.status !== "authenticated" || String(current.user?.memberNo) !== String(profile.memberNo)) return current;
      return { ...current, user: { ...current.user, ...profile, profileImage: null } };
    });
  }, []);

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
      value={{ ...authState, checkAuth, clearAuth, logout, withdraw, applyProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
