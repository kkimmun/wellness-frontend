import api from "./axios";

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
    localStorage.setItem("memberId", credentials.memberId);
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
    const response = await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("memberId");
    return response?.data || { code: 200, message: "로그아웃 성공" };
  },

  sendVerificationEmail: async (email) => {
    return api.post("/mail/auth", {
      emailAddr: email,
    });
  },

  resendVerificationEmail: async (email) => {
    return api.post("/mail/auth/resend", {
      emailAddr: email,
    });
  },

  verifyEmailCode: async (email, authCode) => {
    const body = await api.post("/mail/auth/verification", {
      emailAddr: email,
      authCode: Number(authCode),
    });
    return body?.data ?? body;
  },
};
