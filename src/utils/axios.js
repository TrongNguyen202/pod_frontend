import axios from "axios";
import { ENVIRONMENT_URL, LOCAL_STORAGE_KEY } from "src/constants";

const axiosAPI = axios.create({ baseURL: ENVIRONMENT_URL.API_URL });

const axiosAPIFlashShip = axios.create({
  baseURL: ENVIRONMENT_URL.API_FLASH_SHIP,
});

const axiosAPIPrintCare = axios.create({
  baseURL: ENVIRONMENT_URL.API_PRINT_CARE,
});

const refreshTokenApi = async (config) => {
  const accessToken =
    localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN) || "";

  // if (accessToken) {
  //   let tokenDecode;
  //   try {
  //     tokenDecode = jwtDecode(accessToken);
  //   } catch (error) {
  //     throw createError(HttpStatusCode.BadRequest, 'Invalid access token.');
  //   }

  //   const exp = tokenDecode?.exp;
  //   if (exp && Date.now() >= exp * 1000) {
  //     if (refreshToken) {
  //       try {
  //         const response = await requestRefreshToken(refreshToken);
  //         const accessToken = response?.data?.data?.accessToken;
  //         if (accessToken) {
  //           localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken);
  //           config.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
  //           const customEvent = new CustomEvent('refreshtoken', { detail: { accessToken, refreshToken, guestInfo } });
  //           window.dispatchEvent(customEvent);
  //         }
  //       } catch (error) {
  //         localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
  //         localStorage.removeItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
  //         throw error;
  //       }
  //     } else {
  //       throw createError(HttpStatusCode.BadRequest, 'Token expired. Please provide a refresh token.');
  //     }
  //   } else {
  //     config.headers.Authorization = `Bearer ${accessToken}`;
  //   }
  //   return config;
  // }

  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
};

const refreshTokenApiFlashShip = async (config) => {
  const accessToken =
    localStorage.getItem(LOCAL_STORAGE_KEY.TOKEN_FLASH_SHIP) || "";

  config.headers.Authorization = `${accessToken}`;

  return config;
};

const refreshTokenApiPrintCare = async (config) => {
  const accessToken =
    localStorage.getItem(LOCAL_STORAGE_KEY.TOKEN_PRINT_CARE) || "";

  // if (accessToken) {
  //   let tokenDecode;
  //   try {
  //     tokenDecode = jwtDecode(accessToken);
  //   } catch (error) {
  //     throw createError(HttpStatusCode.BadRequest, 'Invalid access token.');
  //   }

  //   const exp = tokenDecode?.exp;
  //   if (exp && Date.now() >= exp * 1000) {
  //     if (refreshToken) {
  //       try {
  //         const response = await requestRefreshToken(refreshToken);
  //         const accessToken = response?.data?.data?.accessToken;
  //         if (accessToken) {
  //           localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken);
  //           config.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
  //           const customEvent = new CustomEvent('refreshtoken', { detail: { accessToken, refreshToken, guestInfo } });
  //           window.dispatchEvent(customEvent);
  //         }
  //       } catch (error) {
  //         localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
  //         localStorage.removeItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
  //         throw error;
  //       }
  //     } else {
  //       throw createError(HttpStatusCode.BadRequest, 'Token expired. Please provide a refresh token.');
  //     }
  //   } else {
  //     config.headers.Authorization = `Bearer ${accessToken}`;
  //   }
  //   return config;
  // }

  config.headers.Authorization = `${accessToken}`;

  return config;
};

axiosAPI.interceptors.request.use(
  async (config) => {
    return await refreshTokenApi(config, false);
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosAPIFlashShip.interceptors.request.use(
  async (config) => {
    return await refreshTokenApiFlashShip(config, false);
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosAPIPrintCare.interceptors.request.use(
  async (config) => {
    return await refreshTokenApiPrintCare(config, false);
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosAPI, axiosAPIFlashShip, axiosAPIPrintCare };
