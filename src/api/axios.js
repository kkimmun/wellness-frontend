import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN', 
  xsrfHeaderName: 'X-XSRF-TOKEN'
});

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

    if (
      status !== 401 ||
      isAuthEndpoint ||
      originalRequest._retry ||
      !hasToken
    ) {
      return Promise.reject(error.response?.data || error);
    }

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
