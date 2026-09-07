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
    try {
      return await api.post("/auth/logout");
    } finally {
      // 서버 토큰 삭제가 실패하더라도 브라우저의 로그인 상태는 반드시 종료한다.
      clearLocalAuth();
    }
  },

  withdraw: async () => {
    const result = await api.delete("/members");

    try {
      // 회원 삭제 후 서버의 refresh token과 쿠키도 함께 정리한다.
      await api.post("/auth/logout");
    } catch {
      // 회원 삭제는 이미 완료됐으므로 로그아웃 정리 실패로 탈퇴 성공을 뒤집지 않는다.
    } finally {
      clearLocalAuth();
    }

    return result?.data ?? result;
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
