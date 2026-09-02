import api from "./axios";

export const AuthAPI = {
  signup: async (memberData) => {
    const response = await api.post("/members", memberData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    // 관리자 API(Bearer 인증)용으로 응답 body의 accessToken, memberId를 localStorage에 저장
    // 응답이 { data: { accessToken } } 또는 평탄한 { accessToken } 두 형태 모두 대응
    const payload = response?.data ?? response ?? {};
    const accessToken = payload.accessToken ?? response?.accessToken;
    const memberId = payload.memberId ?? response?.memberId;
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (memberId != null) localStorage.setItem("memberId", String(memberId));
    return response.data;
  },

  loginWithGoogle: () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  },

  getMe: async () => {
    const response = await api.get("/members/detail");
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("memberId");
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
