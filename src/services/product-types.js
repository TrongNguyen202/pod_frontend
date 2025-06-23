import { axiosAPI } from 'src/utils/axios';

const requestGetAllProductTypes = async (query) => {
  const config = {
    method: 'GET',
    url: `/product-type/all?${query}`,
  };

  return axiosAPI(config);
};

export const productTypes = {
  requestGetAllProductTypes,
};
