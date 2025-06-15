import axios from 'axios';
import { ENVIRONMENT_URL, LOCAL_STORAGE_KEY } from 'src/constants';

const axiosAPI = axios.create({ baseURL: 'http://localhost:8080/api/v1' });

const axiosAPIFlashShip = axios.create({
  baseURL: ENVIRONMENT_URL.API_FLASH_SHIP,
});

const axiosAPIPrintCare = axios.create({
  baseURL: ENVIRONMENT_URL.API_PRINT_CARE,
});

const refreshTokenApi = async (config) => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN) || '';
  config.headers.Authorization = `Bearer ${accessToken}`;

  try {
    const deviceId = localStorage.getItem('deviceId') || 'unknown';
    const userIp = localStorage.getItem('ipAdrress') || '';
    // const userAgent = localStorage.getItem('userAgent') || '';

    config.headers['X-Device-Id'] = deviceId;
    // config.headers['User-Agent'] = userAgent;
    if (userIp) config.headers['X-Forwarded-For'] = userIp;
  } catch (err) {
    console.warn('Không thể gắn thông tin client vào headers:', err);
  }

  return config;
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

axiosAPI.interceptors.request.use(refreshTokenApi, (error) => Promise.reject(error));
axiosAPIFlashShip.interceptors.request.use(refreshTokenApiFlashShip, (error) => Promise.reject(error));
axiosAPIPrintCare.interceptors.request.use(refreshTokenApiPrintCare, (error) => Promise.reject(error));

export { axiosAPI, axiosAPIFlashShip, axiosAPIPrintCare };
