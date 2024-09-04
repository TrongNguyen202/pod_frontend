import { axiosAPI } from "src/utils/axios";

const requestGetStatisticOrder = (query) => {
  const config = {
    method: "GET",
    url: `/statistics/orders?${query}`,
  };

  return axiosAPI(config);
};

const requestGetStatisticFinance = (query) => {
  const config = {
    method: "GET",
    url: `/statistics/finance?${query}`,
  };

  return axiosAPI(config);
};

export const statistics = {
  requestGetStatisticFinance,
  requestGetStatisticOrder,
};
