import { axiosAPI } from 'src/utils/axios';

const requestPostImages = async (data) => {
  const config = {
    method: 'POST',
    url: `/image/upload`,
    data,
  };

  return axiosAPI(config);
};

export const images = {
  requestPostImages,
};
