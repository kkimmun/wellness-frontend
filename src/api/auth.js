import api from "./axios";

export const AuthAPI = {
  signup: async (memberData) => {
    const response = await api.post("/members", memberData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    // 토큰은 백엔드에서 쿠키로 설정되므로 프론트에서 별도 저장하지 않음
    return response.data;
  },

  loginWithGoogle: () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response?.data || { code: 200, message: "로그아웃 성공" };
  },

  sendVerificationEmail: async (email) => {
    const response = await api.post("/email/verifications", {
      requestEmail: email,
    });
    return response.data;
  },

  verifyEmailCode: async (email, authCode) => {
    const response = await api.post("/email/verifications/confirm", {
      requestEmail: email,
      authCode: authCode,
    });
    return response.data;
  },
};
