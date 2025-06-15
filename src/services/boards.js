import { axiosAPI } from 'src/utils/axios';

const requestGetBoardsByUserId = async (userId, query) => {
  const config = {
    method: 'GET',
    url: `/board/search?userId=${userId}&${query}`,
  };

  return axiosAPI(config);
};

export const boards = {
  requestGetBoardsByUserId,
};
