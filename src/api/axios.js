import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 자동 포함 (인증 토큰용)
  // CSRF 방어용 (Double Submit Cookie 패턴)
  xsrfCookieName: 'XSRF-TOKEN', 
  xsrfHeaderName: 'X-XSRF-TOKEN'
});

// 응답 인터셉터에서 401 발생 시 이벤트 디스패치
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 로그인 요청이 아닌 경우에만 401 세션 만료 처리
    const isLoginRequest = error.config?.url?.includes('/api/auth/login');
    
    if (error.response?.status === 401 && !isLoginRequest) {
      // 401 에러 발생 시 전역으로 세션 만료 이벤트 발송
      window.dispatchEvent(new CustomEvent("sessionExpired"));
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
