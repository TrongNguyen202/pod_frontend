import { axiosAPI } from 'src/utils/axios';

const requestGetStatisticOrder = (query) => {
  const config = {
    method: 'GET',
    url: `/statistic/orders-with-statistics-paginated?${query}`,
  };

  return axiosAPI(config);
};

const requestGetStatisticTransaction = (query) => {
  const config = {
    method: 'GET',
    url: `/statistic/topups-with-statistics-paginated?${query}`,
  };

  return axiosAPI(config);
};

export const statistics = {
  requestGetStatisticOrder,
  requestGetStatisticTransaction,
};
