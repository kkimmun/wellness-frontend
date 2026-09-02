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

// API 인증은 Bearer 토큰 방식이다.
// 로그인 시 localStorage에 저장한 accessToken을 모든 요청 헤더에 부착한다.
// 단 로그인 요청에는 (만료됐을 수 있는) 이전 토큰을 붙이지 않는다.
api.interceptors.request.use((config) => {
  const url = config.url || "";
  if (!url.includes("/auth/login")) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 로그인 요청이 아닌 경우에만 401 세션 만료 처리
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    
    if (error.response?.status === 401 && !isLoginRequest) {
      window.dispatchEvent(new CustomEvent("sessionExpired"));
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
