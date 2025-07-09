import { axiosAPI } from 'src/utils/axios';

const requestPostAuthorizeOauth = async () => {
  const config = {
    method: 'GET',
    url: `/oauth/authorize`,
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

export const oauth = {
  requestPostAuthorizeOauth,
  requestGetStatusOauth,
  requestRevokeOauth,
};
