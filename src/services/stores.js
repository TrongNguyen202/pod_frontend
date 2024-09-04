const { axiosAPI } = require("src/utils/axios");

const requestGetAllStores = async () => {
  const config = {
    method: "GET",
    url: "/shops",
  };

  return axiosAPI(config);
};

const requestCreateStore = async (data) => {
  const config = {
    method: "POST",
    url: "/shops",
    data,
  };

  return axiosAPI(config);
};

const requestGetStoreById = async (id) => {
  const config = {
    method: "GET",
    url: `/shops/${id}`,
  };

  return axiosAPI(config);
};

const requestUpdateStore = async (id, data) => {
  const config = {
    method: "PUT",
    url: `/shops/${id}`,
    data,
  };

  return axiosAPI(config);
};

const requestSearchStores = async (query) => {
  const config = {
    method: "GET",
    url: `/shops?${query}`,
  };

  return axiosAPI(config);
};

const requestRefreshToken = async (ShopId) => {
  const config = {
    method: "POST",
    url: `/shops/${ShopId}/refreshtoken`,
  };

  return axiosAPI(config);
};

export const stores = {
  requestGetAllStores,
  requestCreateStore,
  requestGetStoreById,
  requestUpdateStore,
  requestSearchStores,
  requestRefreshToken,
};
