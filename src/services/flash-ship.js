import { axiosAPI, axiosAPIFlashShip } from "src/utils/axios";

const requestGetFlashShipPODVariant = async () => {
  const config = {
    method: "GET",
    url: `/flashship/all`,
  };

  return axiosAPI(config);
};

const requestLoginFlashShip = async () => {
  const config = {
    method: "GET",
    url: "/seller-api/token",
  };

  return axiosAPIFlashShip(config);
};

const requestCreateOrderFlashShip = async (data) => {
  const config = {
    method: "POST",
    url: "/seller-api/orders/shirt-add",
    data,
  };

  return axiosAPIFlashShip(config);
};

const requestCancelOrderFlashShip = async (data) => {
  const config = {
    method: "POST",
    url: `/seller-api/orders/seller-reject`,
    data,
  };

  return axiosAPIFlashShip(config);
};

const requestDetailOrderFlashShip = async (id) => {
  const config = {
    method: "GET",
    url: `/seller-api/orders/${id}`,
    data,
  };

  return axiosAPIFlashShip(config);
};

const requestGetCkfVariant = async () => {
  const config = {
    method: "GET",
    url: `/ckf/all`,
  };

  return axiosAPI(config);
};
export const flashShip = {
  requestGetFlashShipPODVariant,
  requestLoginFlashShip,
  requestCreateOrderFlashShip,
  requestCancelOrderFlashShip,
  requestDetailOrderFlashShip,
  requestGetCkfVariant,
};
