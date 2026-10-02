import api from "./axios";

const clearLocalAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("memberId");
};

export const AuthAPI = {
  signup: async (memberData) => {
    const body = await api.post("/members", memberData);
    return body?.data ?? body;
  },

  login: async (credentials) => {
    const body = await api.post("/auth/login", credentials);
    const loginResult = body?.data ?? body;
    const accessToken = loginResult?.accessToken;

    if (!accessToken) {
      throw new Error("로그인 응답에서 인증 토큰을 확인할 수 없습니다.");
    }

    localStorage.setItem("accessToken", accessToken);

    const memberId = loginResult?.memberId;
    if (typeof memberId === "string" && memberId.trim()) {
      localStorage.setItem("memberId", memberId);
    } else {
      localStorage.removeItem("memberId");
    }

    return loginResult;
  },

  loginWithGoogle: () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  },

  getMe: async () => {
    const body = await api.get("/members/detail");
    return body?.data ?? body;
  },

  logout: async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      return await api.post("/auth/logout", undefined, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
    } finally {
      clearLocalAuth();
    }
  },

  withdraw: async () => {
    const result = await api.delete("/members");

    try {
      await api.post("/auth/logout");
    } catch {
    } finally {
      clearLocalAuth();
    }

    return result?.data ?? result;
  },

  sendVerificationEmail: async (email) => {
    const body = await api.post("/mail/auth", {
      emailAddr: email,
    });
    return body?.data ?? body;
  },

  resendVerificationEmail: async (email) => {
    const body = await api.post("/mail/auth/resend", {
      emailAddr: email,
    });
    return body?.data ?? body;
  },

  verifyEmailCode: async (email, authCode) => {
    const body = await api.post("/mail/auth/verification", {
      emailAddr: email,
      authCode: Number(authCode),
    });
    return body?.data ?? body;
  },
};
