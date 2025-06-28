import { axiosAPI } from 'src/utils/axios';

const requestGetTransactionInfo = async (query) => {
  const config = {
    method: 'GET',
    url: `/user-topups/get?${query}`,
  };

  return axiosAPI(config);
};

export const usertopups = {
  requestGetTransactionInfo,
};
