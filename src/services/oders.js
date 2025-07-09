import { axiosAPI, axiosAPIDirect } from 'src/utils/axios';

const requestGetOrdersByBoardId = async (query) => {
  const config = {
    method: 'GET',
    url: `/order/search?${query}`,
  };

  return axiosAPI(config);
};

const requestGetAllStatus = async (query) => {
  const config = {
    method: 'GET',
    url: `/order/status-count?${query}`,
  };

  return axiosAPI(config);
};

const requestPostOrder = async (data) => {
  const config = {
    method: 'POST',
    url: `/order/create`,
    data,
  };

  return axiosAPI(config);
};

const requestPostOrders = async (data) => {
  const config = {
    method: 'POST',
    url: `/order/create-many`,
    data,
  };

  return axiosAPI(config);
};

const requestPutOrder = async (orderId, data) => {
  const config = {
    method: 'PUT',
    url: `/order/edit/${orderId}`,
    data,
  };

  return axiosAPI(config);
};

const requestGetOrderById = async (orderId) => {
  const config = {
    method: 'GET',
    url: `/order/${orderId}`,
  };
  return axiosAPI(config);
};

const requestChangeStatusOrders = async (data) => {
  const config = {
    method: 'PUT',
    url: `/order/change-status`,
    data,
  };
  return axiosAPI(config);
};

const requestApiDeleteOrders = async (data) => {
  const config = {
    method: 'DELETE',
    url: `/order/delete-many`,
    data,
  };
  return axiosAPI(config);
};

const requestAssignOrdersForDesigner = async (data) => {
  const config = {
    method: 'PUT',
    url: `/order/assign`,
    data,
  };
  return axiosAPI(config);
};

const requestUploadImagesForDesigner = async (orderId, data) => {
  const config = {
    method: 'POST',
    url: `/order/${orderId}/upload-folder`,
    data,
    timeout: 30000,
  };
  return axiosAPIDirect(config);
};

export const orders = {
  requestGetOrdersByBoardId,
  requestGetAllStatus,
  requestPostOrder,
  requestPostOrders,
  requestPutOrder,
  requestGetOrderById,
  requestChangeStatusOrders,
  requestApiDeleteOrders,
  requestAssignOrdersForDesigner,
  requestUploadImagesForDesigner,
};
