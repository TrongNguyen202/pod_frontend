import { axiosAPI } from 'src/utils/axios';

const requestPostCommentToFirebase = async (data) => {
  const config = {
    method: 'POST',
    url: `/comments/send`,
    data,
  };

  return axiosAPI(config);
};

const requestPostCommentToPosgres = async (data) => {
  const config = {
    method: 'POST',
    url: `/comments/save`,
    data,
  };

  return axiosAPI(config);
};

const requestGetCommentByOrderId = async (orderId) => {
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
