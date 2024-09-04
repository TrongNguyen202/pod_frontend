import { axiosAPI } from "src/utils/axios";

const requestGetWarehousesByShopId = async (id) => {
  const config = {
    method: "GET",
    url: `/shops/${id}/warehouses`,
  };

  return axiosAPI(config);
};

export const warehouses = {
  requestGetWarehousesByShopId,
};
