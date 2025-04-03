// src/utils/axios.js
import axios from "axios";

// 공통 axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 주소
  withCredentials: true, // 필요 시 설정
});

// 요청 전에 토큰 자동으로 붙이는 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
