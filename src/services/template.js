import { axiosAPI } from '../utils/axios';

const requestGetAllTemplate = async () => {
  const config = {
    method: 'GET',
    url: '/templates',
  };

  return axiosAPI(config);
};

const requestCreateTemplate = async (data) => {
  const config = {
    method: 'POST',
    url: '/templates',
    data,
  };

  return axiosAPI(config);
};

const requestUpdateTemplate = async (id, data) => {
  const config = {
    method: 'PUT',
    url: `/templates/${id}`,
    data,
  };

  return axiosAPI(config);
};

const requestDeleteTemplate = async (id) => {
  const config = {
    method: 'DELETE',
    url: `/templates/${id}`,
  };

  return axiosAPI(config);
};

const requestGetAllDesignTemplate = async () => {
  const config = {
    method: 'GET',
    url: '/template-design',
  };

  return axiosAPI(config);
};

const requestCreateDesignTemplate = async (data) => {
  const config = {
    method: 'POST',
    url: '/template-design',
    data,
  };

  return axiosAPI(config);
};

const requestUpdateDesignTemplate = async (id, data) => {
  const config = {
    method: 'PUT',
    url: `/template-design/${id}`,
    data,
  };

  return axiosAPI(config);
};

const requestDeleteDesignTemplate = async (id) => {
  const config = {
    method: 'DELETE',
    url: `/template-design/${id}`,
  };

  return axiosAPI(config);
};

export const template = {
  requestGetAllTemplate,
  requestCreateTemplate,
  requestUpdateTemplate,
  requestDeleteTemplate,
  requestGetAllDesignTemplate,
  requestCreateDesignTemplate,
  requestUpdateDesignTemplate,
  requestDeleteDesignTemplate,
};
