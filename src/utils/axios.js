import axios from 'axios';
import { ENVIRONMENT_URL, LOCAL_STORAGE_KEY } from 'src/constants';

// const axiosAPI = axios.create({ baseURL: ENVIRONMENT_URL.API_URL });
// const axiosAPI = axios.create({ baseURL: 'https://6848f91945f4c0f5ee6f902e.mockapi.io/api/v1' });
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

axiosAPI.interceptors.request.use(
  async (config) => {
    return await refreshTokenApi(config, false);
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosAPIFlashShip.interceptors.request.use(
  async (config) => {
    return await refreshTokenApiFlashShip(config, false);
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosAPIPrintCare.interceptors.request.use(
  async (config) => {
    return await refreshTokenApiPrintCare(config, false);
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { axiosAPI, axiosAPIFlashShip, axiosAPIPrintCare };
