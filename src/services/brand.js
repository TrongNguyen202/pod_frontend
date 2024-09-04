import { axiosAPI } from "src/utils/axios";

const requestGetAllBrand = async (id) => {
  const config = {
    method: "GET",
    url: `/shops/${id}/brands`,
  };

  return axiosAPI(config);
};

export const brand = {
  requestGetAllBrand,
};
