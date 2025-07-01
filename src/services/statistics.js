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

const requestExportExcelStatisticTransaction = (query) => {
  const config = {
    method: 'GET',
    url: `/statistic/topups-statistics-export-excel?${query}`,
    responseType: 'blob', // Để nhận dữ liệu file Excel
  };

  return axiosAPI(config);
};

export const statistics = {
  requestGetStatisticOrder,
  requestGetStatisticTransaction,
  requestExportExcelStatisticTransaction,
};
