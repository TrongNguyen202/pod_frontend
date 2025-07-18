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

const requestUpdateBankInfo = async (data) => {
  const config = {
    method: 'PUT',
    url: '/users/update/user/bank',
    data,
  };

  return axiosAPI(config);
};

const requestGetDesignerIds = async () => {
  const config = {
    method: 'GET',
    url: 'users/d/ids',
  };
  return axiosAPI(config);
};

const requestGetDesignerInfo = async () => {
  const config = {
    method: 'GET',
    url: 'users/d',
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

const requestGetUsersStats = async () => {
  const config = {
    method: 'GET',
    url: '/users/stats',
  };

  return axiosAPI(config);
};

const requestGetUserSettings = async () => {
  const config = {
    method: 'GET',
    url: '/users/settings',
  };

  return axiosAPI(config);
};

const requestPostUserSettings = async (data) => {
  const config = {
    method: 'POST',
    url: '/users/settings',
    data,
  };

  return axiosAPI(config);
};

export const users = {
  requestGetUserInfoByEmail,
  requestGetDesignerIds,
  requestGetDesignerInfo,
  requestSetTaxForDesigner,
  requestPutStatusUser,
  requestUpdateBankInfo,
  requestGetShopByUser,
  requestGetUserInfo,
  requestUpdateUser,
  requestCreateUser,
  requestGetGroupUser,
  requestGetUserShopAll,
  requestUpdateUserProfile,
  requestCreateUserAccount,
  requestGetUsers,
  requestGetUsersStats,
  requestGetUserSettings,
  requestPostUserSettings
};
