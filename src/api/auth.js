import api from "./axios";

export const AuthAPI = {
  // [회원가입] 일반 회원가입
  signup: async (memberData) => {
    const response = await api.post("/api/members", memberData);
    return response.data;
  },

  // [로그인] 일반 로그인
  login: async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);
    // 토큰은 백엔드에서 쿠키로 설정되므로 프론트에서 별도 저장하지 않음
    return response.data;
  },

  // [로그인] 구글 소셜 로그인
  loginWithGoogle: () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  },

  // [인증] 내 정보 가져오기 (세션 확인)
  getMe: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },

  // [로그아웃]
  logout: async () => {
    // 프론트엔드 상태 초기화 로직 (로컬스토리지 삭제 등은 필요 없음)
    // 필요한 경우 백엔드 로그아웃 API 호출
    const response = await api.post("/api/auth/logout");
    return response?.data || { code: 200, message: "로그아웃 성공" };
  },

  // [이메일 인증] 인증 메일 발송 및 재발송 (만료 포함)
  sendVerificationEmail: async (email) => {
    const response = await api.post("/api/email/verifications", { requestEmail: email });
    return response.data;
  },

  // [이메일 인증] 인증번호 확인
  verifyEmailCode: async (email, authCode) => {
    const response = await api.post("/api/email/verifications/confirm", {
      requestEmail: email,
      authCode: authCode,
    });
    return response.data;
  }
};
