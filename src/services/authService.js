// src/services/authService.js
import { axiosAPI } from 'src/utils/axios';
import { LOCAL_STORAGE_KEY } from 'src/constants';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

class AuthService {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Kiểm tra và refresh token tự động khi khởi động ứng dụng
  async initializeAuth() {
    try {
      const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
      
      if (!accessToken) {
        // Không có access token, thử refresh từ cookie
        return await this.tryRefreshFromCookie();
      }

      // Kiểm tra access token có hết hạn không
      if (this.isTokenExpired(accessToken)) {
        // Token hết hạn, thử refresh
        return await this.tryRefreshFromCookie();
      }

      // Token còn hạn, trả về thông tin user
      return this.getUserFromToken(accessToken);
    } catch (error) {
      console.error('Error initializing auth:', error);
      return null;
    }
  }

  // Thử refresh token từ cookie
  async tryRefreshFromCookie() {
    try {
      const response = await axiosAPI.post('/auth/refresh', {}, {
        withCredentials: true, // Quan trọng: gửi cookie
      });

      if (response.data?.accessToken) {
        const newAccessToken = response.data.accessToken;
        localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, newAccessToken);
        
        // Lưu thông tin user tạm thời
        const decodedToken = jwtDecode(newAccessToken);
        localStorage.setItem(LOCAL_STORAGE_KEY.USER_IP, decodedToken.ipAddress);
        localStorage.setItem(LOCAL_STORAGE_KEY.DEVICE_ID, decodedToken.deviceId);
        localStorage.setItem(LOCAL_STORAGE_KEY.USER_EMAIL, decodedToken.sub);

        // Xóa thông tin tạm sau 3 giây
        setTimeout(() => {
          localStorage.removeItem(LOCAL_STORAGE_KEY.USER_IP);
          localStorage.removeItem(LOCAL_STORAGE_KEY.DEVICE_ID);
          localStorage.removeItem(LOCAL_STORAGE_KEY.USER_EMAIL);
        }, 3000);

        return this.getUserFromToken(newAccessToken);
      }
    } catch (error) {
      console.error('Refresh token failed:', error);
      // Xóa access token cũ nếu refresh thất bại
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    }
    return null;
  }

  // Kiểm tra token có hết hạn không
  isTokenExpired(token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Lấy thông tin user từ token
  getUserFromToken(token) {
    try {
      const decodedToken = jwtDecode(token);
      return {
        email: decodedToken.sub,
        role: decodedToken.role,
        exp: decodedToken.exp,
        ipAddress: decodedToken.ipAddress,
        deviceId: decodedToken.deviceId,
        userAgent: decodedToken.userAgent,
      };
    } catch (error) {
      return null;
    }
  }

  // Login method
  async login(credentials) {
    try {
      // Debug user agent
      const userAgent = navigator.userAgent;

      // Debug device ID generation
      let deviceId;
      try {
        deviceId = crypto.randomUUID();
      } catch (error) {
        deviceId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      }

      // Debug IP detection
      let ip;
      try {
        const ipRes = await fetch('https://api64.ipify.org?format=json');
        if (!ipRes.ok) {
          throw new Error(`HTTP error! status: ${ipRes.status}`);
        }
        const ipData = await ipRes.json();
        ip = ipData.ip;
      } catch (error) {
        ip = 'unknown';
      }

      const loginData = {
        email: credentials.email,
        password: credentials.password,
        ipAddress: ip,
        userAgent,
        deviceId,
      };

      const response = await axiosAPI.post('/auth/login', loginData, {
        withCredentials: true, // Quan trọng: để nhận cookie
      });

      if (response.data?.accessToken) {
        const accessToken = response.data.accessToken;
        localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken);
        
        const decodedToken = jwtDecode(accessToken);
        // Lưu thông tin tạm thời
        localStorage.setItem(LOCAL_STORAGE_KEY.USER_IP, decodedToken.ipAddress);
        localStorage.setItem(LOCAL_STORAGE_KEY.DEVICE_ID, decodedToken.deviceId);
        localStorage.setItem(LOCAL_STORAGE_KEY.USER_EMAIL, decodedToken.sub);

        // Xóa thông tin tạm sau 3 giây
        setTimeout(() => {
          localStorage.removeItem(LOCAL_STORAGE_KEY.USER_IP);
          localStorage.removeItem(LOCAL_STORAGE_KEY.DEVICE_ID);
          localStorage.removeItem(LOCAL_STORAGE_KEY.USER_EMAIL);
        }, 3000);

        return this.getUserFromToken(accessToken);
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout method
  async logout() {
    try {
      // Gọi API logout để xóa refresh token cookie
      await axiosAPI.post('/auth/logout', {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Xóa local storage
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEY.USER_IP);
      localStorage.removeItem(LOCAL_STORAGE_KEY.DEVICE_ID);
      localStorage.removeItem(LOCAL_STORAGE_KEY.USER_EMAIL);
    }
  }

  // Refresh token method axios interceptor
  async refreshToken() {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const response = await axiosAPI.post('/auth/refresh', {}, {
        withCredentials: true,
      });

      const newAccessToken = response.data?.accessToken;
      if (newAccessToken) {
        localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, newAccessToken);
        this.processQueue(null, newAccessToken);
        return newAccessToken;
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      this.processQueue(error, null);
      // Xóa token cũ và chuyển về trang login
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
      window.location.href = '/auth/login';
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }
}

export const authService = new AuthService();