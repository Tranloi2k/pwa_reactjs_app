// src/app/axios-config.ts

import axios from "axios";

// Tạo một instance Axios với cấu hình tùy chỉnh
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BE_URL, // Thay đổi URL theo API của bạn
  timeout: 10000, // Thời gian timeout (10 giây)
  headers: {
    "Content-Type": "application/json",
    // Có thể thêm các header khác ở đây
  },
  withCredentials: true,
});

// Bạn có thể thêm interceptor nếu cần
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm token hoặc làm gì đó trước khi gửi request
    const accessToken = localStorage.getItem("access_token");
    config.headers["Authorization"] = "Bearer " + accessToken;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    // Xử lý lỗi tại đây
    if (error.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        const refreshResponse: { accessToken: string; refreshToken: string } =
          await axiosInstance.post("/token", { refreshToken });
        localStorage.setItem("access_token", refreshResponse.accessToken);
        localStorage.setItem("refresh_token", refreshResponse.refreshToken);
        return;
      }
    }
    console.error("HTTP Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
