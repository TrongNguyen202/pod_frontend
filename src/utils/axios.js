import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { LOCAL_STORAGE_KEY } from 'src/constants';

// Sử dụng proxy routes thay vì direct URLs
// const axiosAPI = axios.create({
//   baseURL: '/api/proxy/com', // Sẽ proxy đến BASE_URL
// });

// const axiosAPIFlashShip = axios.create({
//   baseURL: '/api/proxy/com', // Sẽ proxy đến API_FLASH_SHIP
// });

// const axiosAPIPrintCare = axios.create({
//   baseURL: '/api/proxy/com', // Sẽ proxy đến API_PRINT_CARE
// });

const axiosAPI = axios.create({ baseURL: 'https://api.sundesign.io/api/v1' });

const axiosAPIFlashShip = axios.create({
  baseURL: "ENVIRONMENT_URL.API_FLASH_SHIP",
});

const axiosAPIPrintCare = axios.create({
  baseURL: "ENVIRONMENT_URL.API_PRINT_CARE",
});

const getCommonHeaders = () => {
  const headers = {};

  if (typeof window !== 'undefined') {
    // Thử lấy từ localStorage trước
    let deviceId = localStorage.getItem(LOCAL_STORAGE_KEY.DEVICE_ID);
    let userIp = localStorage.getItem(LOCAL_STORAGE_KEY.USER_IP);

    // Nếu không có trong localStorage decode từ token
    if (!deviceId || !userIp) {
      const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          deviceId = decodedToken.deviceId;
          userIp = decodedToken.ipAddress;
        } catch (error) {
          console.error('Error decoding token in getCommonHeaders:', error);
        }
      }
    }

    if (deviceId) headers['X-Device-Id'] = deviceId;
    if (userIp) headers['X-Forwarded-For'] = userIp;
  }

  return headers;
};

const refreshTokenApi = async (config) => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN) || '';

  if (!config.headers) config.headers = {};
  config.headers.Authorization = `Bearer ${accessToken}`;

  const commonHeaders = getCommonHeaders();
  Object.entries(commonHeaders).forEach(([key, value]) => {
    config.headers[key] = value;
  });

  return config;
};

const refreshToken = async () => {
  const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
  if (!refreshToken) throw new Error('Không tìm thấy refresh token');

  const response = await axios.post(
    'https://api.sundesign.io/api/v1/auth/refresh',
    { refreshToken },
    { headers: { ...getCommonHeaders(), 'Content-Type': 'application/json' } },
  );

  const newAccessToken = response.data?.accessToken;
  const newRefreshToken = response.data?.refreshToken;

  localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, newAccessToken);
  localStorage.setItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN, newRefreshToken);

  return newAccessToken;
};

const refreshTokenApiFlashShip = async (config) => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.TOKEN_FLASH_SHIP) || '';
  config.headers.Authorization = `${accessToken}`;
  return config;
};

const refreshTokenApiPrintCare = async (config) => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.TOKEN_PRINT_CARE) || '';
  config.headers.Authorization = `${accessToken}`;
  return config;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosAPI.interceptors.request.use(refreshTokenApi, (error) => Promise.reject(error));

axiosAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosAPI(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosAPI(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

axiosAPIFlashShip.interceptors.request.use(refreshTokenApiFlashShip, (error) => Promise.reject(error));
axiosAPIPrintCare.interceptors.request.use(refreshTokenApiPrintCare, (error) => Promise.reject(error));

export { axiosAPI, axiosAPIFlashShip, axiosAPIPrintCare };
