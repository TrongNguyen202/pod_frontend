import { axiosAPI } from 'src/utils/axios';

const requestSendPushNotifications = async (data) => {
  const config = {
    method: 'POST',
    url: `/notifications/send-push`,
    data,
  };

  return axiosAPI(config);
};

export const notifications = {
  requestSendPushNotifications,
};
