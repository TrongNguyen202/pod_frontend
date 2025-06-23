import { axiosAPI } from 'src/utils/axios';

const requestGetWalletInfo = async (data) => {
  const config = {
    method: 'POST',
    url: `/user-wallet/get-detail`,
    data,
  };

  return axiosAPI(config);
};

export const userwallets = {
  requestGetWalletInfo,
};
