import { axiosAPI } from 'src/utils/axios';

const requestGetUserInfoByEmail = async (data) => {
  const config = {
    method: 'POST',
    url: '/users/get-detail',
    data,
  };

  return axiosAPI(config);
};

const requestUpdateUserProfile = async (data) => {
  const config = {
    method: 'POST',
    url: '/users/update',
    data,
  };

  return axiosAPI(config);
};

const requestGetDesignerIds = async () => {
  const config = {
    method: 'GET',
    url: 'users/designers/ids',
  };
  return axiosAPI(config);
};

const requestSetTaxForDesigner = async (data) => {
  const config = {
    method: 'POST',
    url: '/users/set-tax',
    data,
  };

  return axiosAPI(config);
};

const requestPutStatusUser = async (data) => {
  const config = {
    method: 'PUT',
    url: '/users/update/status',
    data,
  };  

  return axiosAPI(config);
};

const requestGetShopByUser = async () => {
  const config = {
    method: 'GET',
    url: '/user-shops/groups',
  };

  return axiosAPI(config);
};

const requestGetUserInfo = async (userId) => {
  const config = {
    method: 'GET',
    url: `/user/${userId}/groups/infor`,
  };

  return axiosAPI(config);
};

const requestUpdateUser = async (data) => {
  const config = {
    method: 'PUT',
    url: `/groups/change_user`,
    data,
  };

  return axiosAPI(config);
};

const requestCreateUser = async (data) => {
  const config = {
    method: 'POST',
    url: `/groups/add_user_group`,
    data,
  };

  return axiosAPI(config);
};

const requestGetGroupUser = async () => {
  const config = {
    method: 'GET',
    url: `/groupcustoms/`,
  };

  return axiosAPI(config);
};

const requestGetUserShopAll = async (groupId) => {
  const config = {
    method: 'GET',
    url: `/user-shop-all/${groupId}`,
  };

  return axiosAPI(config);
};

const requestCreateUserAccount = async (data) => {
  const config = {
    method: 'POST',
    url: '/users/create',
    data,
  };

  return axiosAPI(config);
};

const requestGetUsers = async (data) => {
  const config = {
    method: 'POST',
    url: '/users/get-all',
    data,
  };

  return axiosAPI(config);
};

export const users = {
  requestGetUserInfoByEmail,
  requestGetDesignerIds,
  requestSetTaxForDesigner,
  requestPutStatusUser,
  requestGetShopByUser,
  requestGetUserInfo,
  requestUpdateUser,
  requestCreateUser,
  requestGetGroupUser,
  requestGetUserShopAll,
  requestUpdateUserProfile,
  requestCreateUserAccount,
  requestGetUsers
};
