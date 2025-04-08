// src/utils/axios.js
import axios from "axios";
import Cookies from "js-cookie";
import useUserStore from "../store/userStore";
import useConfigStore from "../store/configStore";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// ✅ 재발급용 axios 인스턴스 (인터셉터 안 걸림)
const refreshApi = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// 로그아웃 함수
const logout = () => {
  useUserStore.getState().clearUser();
  window.location.href = "/login";
};

// 요청 전에 토큰 자동으로 붙이는 인터셉터
api.interceptors.request.use(
  (config) => {
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
    const originalRequest = error.config;

    // ✅ reissue 요청 실패 시 바로 로그아웃
    if (originalRequest.url.includes("/users/reissue")) {
      logout();
      return Promise.reject(error);
    }

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("리프레시 토큰 없음");

        const accessToken = Cookies.get("token");
        const userCookie = JSON.parse(Cookies.get("user")); // ✅ 문자열 → 객체
  
        const user = {
          userId: userCookie.userId,
          token : {
            "refreshToken" : refreshToken,
            "accessToken" : accessToken
          }
        };
        
        const { data } = await refreshApi.post("/users/reissue", user);

        const configStore = useConfigStore.getState().config;
        
        Cookies.set("token", data.token.accessToken, {
          expires: configStore.liveAccessToken,
          secure: true,
          sameSite: "Strict",
        });

        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (reissueError) {
        console.error("토큰 재발급 실패:", reissueError);
        logout(); // ✅ 재발급 실패 시 바로 로그아웃!
        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
