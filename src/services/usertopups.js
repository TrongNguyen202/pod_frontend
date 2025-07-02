import { axiosAPI } from 'src/utils/axios';

const requestGetTransactionInfo = async (query) => {
  const config = {
    method: 'GET',
    url: `/user-topups/get?${query}`,
  };

  return axiosAPI(config);
};

const requestUpdateStatusTransaction = async (data) => {
  const config = {
    method: 'PUT',
    url: `user-topups/update/status/transaction`,
    data,
  };

  return axiosAPI(config);
};

const requestCreateWithdraw = async (data) => {
  const config = {
    method: 'POST',
    url: `user-topups/create/withdraw`,
    data,
  };

  return axiosAPI(config);
};


export const usertopups = {
  requestGetTransactionInfo,
  requestUpdateStatusTransaction,
  requestCreateWithdraw,
};
