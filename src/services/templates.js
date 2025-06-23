import { axiosAPI } from 'src/utils/axios';

const requestGetTemplatesByBoardId = async (boardId, query) => {
  const config = {
    method: 'GET',
    url: `/template/get-by-board?boardId=${boardId}&${query}`,
  };

  return axiosAPI(config);
};

const requestPostTemplate = async ({ data }) => {
  const config = {
    method: 'POST',
    url: `/template/create`,
    data,
  };

  return axiosAPI(config);
};

const requestDeleteTemplateById = async ({ templateId }) => {
  const config = {
    method: 'DELETE',
    url: `/template/delete?id=${templateId}`,
  };

  return axiosAPI(config);
};

export const templates = {
  requestGetTemplatesByBoardId,
  requestPostTemplate,
  requestDeleteTemplateById,
};
