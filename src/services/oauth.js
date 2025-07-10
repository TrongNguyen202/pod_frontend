import { axiosAPI } from 'src/utils/axios';

const requestPostAuthorizeOauth = async () => {
  const config = {
    method: 'GET',
    url: `/oauth/authorize`,
  };

  return axiosAPI(config);
};

const requestPostAuthorizeOauthAdmin = async () => {
  const config = {
    method: 'GET',
    url: `/oauth/authorize-owner-drive-sun-design`,
  };

  return axiosAPI(config);
};

const requestGetStatusOauth = async () => {
  const config = {
    method: 'GET',
    url: `/oauth/status`,
  };

  return axiosAPI(config);
};

const requestRevokeOauth = async () => {
  const config = {
    method: 'POST',
    url: `/oauth/revoke`,
  };

  return axiosAPI(config);
};

const requestRevokeOauthAdmin = async () => {
  const config = {
    method: 'POST',
    url: `/oauth/revoke-owner`,
  };

  return axiosAPI(config);
};

const requestGetDriveInfoAdmin = async () => {
  const config = {
    method: 'GET',
    url: `/oauth/storage-info`,
  };

  return axiosAPI(config);
};

export const oauth = {
  requestPostAuthorizeOauth,
  requestPostAuthorizeOauthAdmin,
  requestGetStatusOauth,
  requestRevokeOauth,
  requestRevokeOauthAdmin,
  requestGetDriveInfoAdmin,
};
