import { axiosAPI } from 'src/utils/axios';

const requestCreatePayment = async (data) => {
  const config = {
    method: 'POST',
    url: `/user-topups/create`,
    data,
  };

  return axiosAPI(config);
};

const requestUpdateUserTopup = async (data) => {
  const config = {
    method: 'POST',
    url: `/user-topups/update`,
    data,
  };

  return axiosAPI(config);
};

const requestUpdateStatusOf = async (orderId) => {
  const config = {
    method: 'GET',
    url: `/comments/get?orderId=${orderId}`,
  };

  return axiosAPI(config);
};

export const comments = {
  requestPostCommentToFirebase,
  requestPostCommentToPosgres,
  requestGetCommentByOrderId,
};
