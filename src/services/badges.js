const { axiosAPI } = require('src/utils/axios');

const requestGetAllBadges = async () => {
  const config = {
    method: 'GET',
    url: '/admin/v1/badges',
  };

  return axiosAPI(config);
};
export const badges = {
  requestGetAllBadges,
};
