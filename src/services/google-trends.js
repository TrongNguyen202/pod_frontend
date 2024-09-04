import { axiosAPI } from "src/utils/axios";

const requestGetGoogleTrendOptions = async () => {
  const config = {
    method: "GET",
    url: `/ggtrend/options`,
  };

  return axiosAPI(config);
};

const requestGetGoogleTrendData = async (query) => {
  const config = {
    method: "GET",
    url: `/ggtrend/query${query || ""}`,
  };

  return axiosAPI(config);
};

export const googleTrend = {
  requestGetGoogleTrendOptions,
  requestGetGoogleTrendData,
};
