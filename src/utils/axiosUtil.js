// src/utils/axios.js
import axios from "axios";
import Cookies from "js-cookie";
import useUserStore from "../store/userStore";
import { auth } from "../api/endpoints";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// 재발급용 axios 인스턴스 (인터셉터 안 걸림)
export const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// 로그아웃 함수
const logout = () => {
  useUserStore.getState().clearUser();
};

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 로그아웃 API 요청은 항상 허용
    if (config.url === "/users/logout") {
      const token = Cookies.get("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    }
    
    // 로그아웃 중이면 다른 요청 취소
    if (useUserStore.getState().isLoggingOut) {
      const controller = new AbortController();
      controller.abort();
      config.signal = controller.signal;
      return config;
    }
    
    const token = Cookies.get("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 요청이 취소된 경우 무시
    if (axios.isCancel(error)) {
      return Promise.reject(new Error("로그아웃 중 요청이 취소되었습니다."));
    }
    
    const originalRequest = error.config;

    // reissue 요청 실패 시 바로 로그아웃
    if (originalRequest.url.includes("/users/reissue")) {
      logout();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && error.response?.data === "Invalid token" && !originalRequest._retry) {
      // 로그아웃 중이면 재시도 하지 않음
      if (useUserStore.getState().isLoggingOut) {
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("리프레시 토큰 없음");

        const accessToken = Cookies.get("token");
        let userCookie;
        
        try {
          userCookie = JSON.parse(Cookies.get("user") || "{}");
          if (!userCookie.userId) throw new Error("유저 정보 없음");
        } catch (e) {
          throw new Error("유저 정보 파싱 실패");
        }
  
        const user = {
          userId: userCookie.userId,
          token : {
            "refreshToken" : refreshToken,
            "accessToken" : accessToken
          }
        };
        
        const data = await auth.reissueToken(user);
        originalRequest.headers["Authorization"] = `Bearer ${data.token.accessToken}`;
        return api(originalRequest);
      } catch (reissueError) {
        console.error("토큰 재발급 실패:", reissueError);
        logout();
        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  }
);

// axios 메서드 래퍼 함수들
export const axiosUtil = {
  get: (url, params) => api.get(url, { params }),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  patch: (url, data) => api.patch(url, data),
  delete: (url, data) => api.delete(url, { data: data })
};

export default api;
