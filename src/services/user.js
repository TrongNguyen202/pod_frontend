import { axiosAPI } from "src/utils/axios";

const requestGetShopByUser = async () => {
  const config = {
    method: "GET",
    url: "/user-shops/groups",
  };

  return axiosAPI(config);
};

const requestGetUserInfo = async (userId) => {
  const config = {
    method: "GET",
    url: `/user/${userId}/groups/infor`,
  };

  return axiosAPI(config);
};

const requestUpdateUser = async (data) => {
  const config = {
    method: "PUT",
    url: `/groups/change_user`,
    data,
  };

  return axiosAPI(config);
};

const requestCreateUser = async (data) => {
  const config = {
    method: "POST",
    url: `/groups/add_user_group`,
    data,
  };

  return axiosAPI(config);
};

const requestGetGroupUser = async () => {
  const config = {
    method: "GET",
    url: `/groupcustoms/`,
  };

  return axiosAPI(config);
};

const requestGetUserShopAll = async (groupId) => {
  const config = {
    method: "GET",
    url: `/user-shop-all/${groupId}`,
  };

  return axiosAPI(config);
};

export const users = {
  requestGetShopByUser,
  requestGetUserInfo,
  requestUpdateUser,
  requestCreateUser,
  requestGetGroupUser,
  requestGetUserShopAll,
};
