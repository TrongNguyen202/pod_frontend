import { axiosAPI } from 'src/utils/axios';

const requestPostCreateQr = async (userId, amount, transactionCode) => {
  const config = {
    method: 'POST',
    url: `/qr-transaction?userId=${userId}&amount=${amount}&transactionCode=${transactionCode}`,
  };

  return axiosAPI(config);
};

const requestGetPendingQr = async (userId) => {
  const config = {
    method: 'GET',
    url: `/qr-transaction/pending?userId=${userId}`,
  };

  return axiosAPI(config);
};

const requestPostWebhookSepay = async (data) => {
  const config = {
    method: 'POST',
    url: `/qr-transaction/webhook`,
    data,
  };

  return axiosAPI(config);
};

const requestGetPaymentInfo = async (transactionCode) => {
  const config = {
    method: 'GET',
    url: `/qr-transaction/status?transactionCode=${transactionCode}`,
  };

  return axiosAPI(config);
};

export const qrtransaction = {
  requestPostCreateQr,
  requestGetPendingQr,
  requestPostWebhookSepay,
  requestGetPaymentInfo,
};
