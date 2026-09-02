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
// 단 로그인/토큰 재발급 요청에는 (만료됐을 수 있는) 이전 토큰을 붙이지 않는다.
api.interceptors.request.use((config) => {
  const url = config.url || "";
  const skipAuth =
    url.includes("/auth/login") || url.includes("/auth/refresh");
  if (!skipAuth) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- Access Token 자동 재발급 처리 -------------------------------------------
// Access Token 만료로 401이 오면 /auth/refresh 로 새 Access Token을 발급받아
// 기존 토큰을 교체하고 실패했던 요청을 다시 시도한다.
// Refresh Token까지 만료되어 재발급이 실패하면 로그아웃 후 로그인 페이지로 이동한다.
let isRefreshing = false;
let pendingQueue = [];

const resolveQueue = (error, token) => {
  pendingQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      config.headers.Authorization = `Bearer ${token}`;
      resolve(api(config));
    }
  });
  pendingQueue = [];
};

const forceLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("memberId");
  window.dispatchEvent(new CustomEvent("sessionExpired"));
};

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;
    const url = originalRequest.url || "";
    const isAuthEndpoint =
      url.includes("/auth/login") || url.includes("/auth/refresh");
    const hasToken = !!localStorage.getItem("accessToken");

    // 재발급 대상이 아닌 경우: 기존과 동일하게 그대로 거절
    if (
      status !== 401 ||
      isAuthEndpoint ||
      originalRequest._retry ||
      !hasToken
    ) {
      return Promise.reject(error.response?.data || error);
    }

    // 이미 재발급이 진행 중이면 큐에 넣고 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const body = await api.post("/auth/refresh");
      const newToken = body?.data?.accessToken ?? body?.accessToken;
      if (!newToken) throw new Error("refresh 응답에 accessToken이 없습니다.");

      localStorage.setItem("accessToken", newToken);
      resolveQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      resolveQueue(refreshError, null);
      forceLogout();
      return Promise.reject(refreshError.response?.data || refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
