import { axiosAPI } from 'src/utils/axios';

const requestGetAllOrders = async (query) => {
  const config = {
    method: 'GET',
    url: `/orders?${query}`,
  };

  return axiosAPI(config);
};

const requestGetAllOrderByShop = async (id) => {
  const config = {
    method: 'GET',
    url: `/shops/${id}/orders/detail`,
  };

  return axiosAPI(config);
};

const requestGetLabelById = async (orderId) => {
  const config = {
    method: 'GET',
    url: `/shops/orders/${orderId}/search_file`,
  };

  return axiosAPI(config);
};

const requestUploadLabelToDriver = async (data) => {
  const config = {
    method: 'POST',
    url: `/shops/upload_driver`,
    data,
  };

  return axiosAPI(config);
};

const requestGetToShipInfor = async (shopId, data) => {
  const config = {
    method: 'POST',
    url: `/shops/${shopId}/orders/toship_infor`,
    data,
  };

  return axiosAPI(config);
};

const requestGetAllCombine = async (shopId) => {
  const config = {
    method: 'GET',
    url: `/shops/${shopId}/pre_combine_pkg`,
  };

  return axiosAPI(config);
};

const requestConfirmCombine = async (shopId, data) => {
  const config = {
    method: 'POST',
    url: `/shops/${shopId}/confirm_combine_pkg`,
    data,
  };

  return axiosAPI(config);
};

const requestCreateLabel = async (shopId, data) => {
  const config = {
    method: 'POST',
    url: `/shops/${shopId}/packages/package_detail`,
    data,
  };

  return axiosAPI(config);
};

const requestShippingService = async (shopId, data) => {
  const config = {
    method: 'POST',
    url: `/shops/${shopId}/shipping_service`,
    data,
  };

  return axiosAPI(config);
};

const requestByLabel = async (shopId, data) => {
  const config = {
    method: 'POST',
    url: `/shops/${shopId}/packages/buy_label`,
    data,
  };

  return axiosAPI(config);
};

const requestGetShippingDoc = async (id, data) => {
  const config = {
    method: 'POST',
    url: `/shops/${id}/get_shipping_doc_package_ids`,
    data,
  };

  return axiosAPI(config);
};

const requestGetPackageBought = async () => {
  const config = {
    method: 'GET',
    url: `/shops/get_package_buyed`,
  };

  return axiosAPI(config);
};

const requestPdfLabelSearch = async (packageId) => {
  const config = {
    method: 'GET',
    url: `/pdf-search/?query=${packageId}`,
  };

  return axiosAPI(config);
};

const requestPdfLabelDownload = async (fileName) => {
  const config = {
    method: 'GET',
    url: `/pdf-download/?filename=${fileName}`,
  };

  return axiosAPI(config);
};

const requestGetDesignSku = async () => {
  const config = {
    method: 'GET',
    url: '/designskus/',
  };

  return axiosAPI(config);
};

const requestGetDesignSkuSize = async (page) => {
  const config = {
    method: 'GET',
    url: `/designskus/?page=${page}`,
    data,
  };

  return axiosAPI(config);
};

const requestGetDesignSkuGroup = async (groupId) => {
  const config = {
    method: 'GET',
    url: `/designskus/find_by_group/${groupId}`,
  };

  return axiosAPI(config);
};

const requestGetDesignSkuGroupSize = async (groupId, page) => {
  const config = {
    method: 'GET',
    url: `/designskus/find_by_group/${groupId}?page=${page}`,
  };

  return axiosAPI(config);
};

const requestPostDesignSku = async (data) => {
  const config = {
    method: 'POST',
    url: '/designskus/',
    data,
  };

  return axiosAPI(config);
};

const requestPutDesignSku = async (data, designId) => {
  const config = {
    method: 'PUT',
    url: `/designskus/${designId}/`,
    data,
  };

  return axiosAPI(config);
};

const requestDeleteDesignSku = async (data, designId) => {
  const config = {
    method: 'DELETE',
    url: `/designskus/${designId}/`,
    data,
  };

  return axiosAPI(config);
};

const requestPdfLabelLinkSearch = async (data) => {
  const config = {
    method: 'POST',
    url: `/pdf-upload-search`,
    data,
  };

  return axiosAPI(config);
};

const requestSearchDesignSky = async (skuId) => {
  const config = {
    method: 'GET',
    url: `/designskus/${skuId}`,
  };

  return axiosAPI(config);
};

const requestPackageCreateFlashShip = async (shopId, data) => {
  const config = {
    method: 'POST',
    url: `/shop/${shopId}/packages/create_flash`,
    data,
  };

  return axiosAPI(config);
};

const requestPackageCreatePrintCare = async (shopId, data) => {
  const config = {
    method: 'POST',
    url: `/shop/${shopId}/packages/create_print`,
    data,
  };

  return axiosAPI(config);
};

const requestPackageFulfillmentCompleted = async (shopId) => {
  const config = {
    method: 'GET',
    url: `/shop/${shopId}/packages/list`,
  };

  return axiosAPI(config);
};

const requestPackageFulfillmentCompletedInActive = async (packageId, data) => {
  const config = {
    method: 'PUT',
    url: `/package/${packageId}/deactive`,
    data,
  };

  return axiosAPI(config);
};

const requestCancelOder = async (shopId, data) => {
  const config = {
    method: 'PUT',
    url: `/shop/${shopId}/orders/cancel`,
    data,
  };

  return axiosAPI(config);
};

export const orders = {
  requestGetAllOrders,
  requestGetLabelById,
  requestUploadLabelToDriver,
  requestGetToShipInfor,
  requestGetAllCombine,
  requestConfirmCombine,
  requestCreateLabel,
  requestShippingService,
  requestByLabel,
  requestGetShippingDoc,
  requestGetPackageBought,
  requestPdfLabelSearch,
  requestPdfLabelDownload,
  requestGetDesignSku,
  requestGetDesignSkuSize,
  requestGetDesignSkuGroup,
  requestGetDesignSkuGroupSize,
  requestPostDesignSku,
  requestPutDesignSku,
  requestDeleteDesignSku,
  requestPdfLabelLinkSearch,
  requestSearchDesignSky,
  requestPackageCreateFlashShip,
  requestPackageCreatePrintCare,
  requestPackageFulfillmentCompleted,
  requestPackageFulfillmentCompletedInActive,
  requestCancelOder,
  requestGetAllOrderByShop,
};
