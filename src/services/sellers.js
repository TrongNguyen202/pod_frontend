import { axiosAPI } from "src/utils/axios";

const requestGetAllSellers = async () => {
  const config = {
    method: "GET",
    url: "/admin/manage/users",
  };

  return axiosAPI(config);
};

const requestGetSellersById = async (id) => {
  const config = {
    method: "GET",
    url: `/admin/manage/users/${id}`,
  };

  return axiosAPI(config);
};

const requestSearchSeller = async (query) => {
  const config = {
    method: "GET",
    url: `/admin/manage/users?${query}`,
  };

  return axiosAPI(config);
};

export const sellers = {
  requestGetAllSellers,
  requestGetSellersById,
  requestSearchSeller,
};
