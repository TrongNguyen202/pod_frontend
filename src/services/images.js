import { axiosAPI } from 'src/utils/axios';

const requestPostImages = async (data) => {
  if (!(data instanceof FormData)) {
    throw new Error('Dữ liệu phải là FormData');
  }
  const config = {
    method: 'POST',
    url: `/image/upload`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data', // Tùy chọn
    },
  };
  const response = await axiosAPI(config);
  console.log('API response:', response); // Log response
  return response;
};

export const images = {
  requestPostImages,
};
