import { axiosAPI } from 'src/utils/axios';

const requestPostFcmToken = async (data) => {
  const config = {
    method: 'POST',
    url: `/fcm-token`,
    data,
  };

  return axiosAPI(config);
};

const requestGetFcmTokenByUserId = async (userId) => {
  const config = {
    method: 'GET',
    url: `/fcm-token?userId=${userId}`,
  };

  return axiosAPI(config);
};

export const fcmtoken = {
  requestPostFcmToken,
  requestGetFcmTokenByUserId,
};
