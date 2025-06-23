import { axiosAPI } from 'src/utils/axios';

const requestGetBoardsByUserId = async (userId, query) => {
  const config = {
    method: 'GET',
    url: `/board/search?userId=${userId}&${query}`,
  };

  return axiosAPI(config);
};

const requestGetBoardInfoById = async (boardId) => {
  const config = {
    method: 'GET',
    url: `/board/detail/${boardId}`,
  };

  return axiosAPI(config);
};

const updateBoardInfoById = async (boardId, data) => {
  const config = {
    method: 'PUT',
    url: `/board/edit/${boardId}`,
    data,
  };

  return axiosAPI(config);
};

export const boards = {
  requestGetBoardsByUserId,
  requestGetBoardInfoById,
  updateBoardInfoById,
};
