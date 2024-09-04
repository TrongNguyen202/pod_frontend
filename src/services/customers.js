import { axiosAPI } from "src/utils/axios";

const requestGetAllCustomer = async (keyword) => {
  const config = {
    method: "GET",
    url: `/admin/v1/manage/customers?search=${keyword}`,
  };

  return axiosAPI(config);
};

const requestGetCustomerById = async (id) => {
  const config = {
    method: "GET",
    url: `/admin/v1/manage/customers/${id}`,
  };

  return axiosAPI(config);
};

export const customers = {
  requestGetAllCustomer,
  requestGetCustomerById,
};
