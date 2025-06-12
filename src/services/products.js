import { axiosAPI } from 'src/utils/axios';

const requestGetAllShop = async (pageNumber) => {
  const config = {
    method: 'GET',
    url: `/free`,
  };

  return axiosAPI(config);
};

const requestGetInfomationBoards = async (boardId) => {
  const config = {
    method: 'GET',
    url: `/boards/${boardId}`,
  };

  return axiosAPI(config);
};

const requestGetInfoBoardById = async (boardId, pageNumber) => {
  const config = {
    method: 'GET',
    url: `/free/${boardId}`,
  };

  return axiosAPI(config);
};

const requestGetAllProducts = async (id, pageNumber) => {
  const config = {
    method: 'GET',
    url: `/shops/${id}/products/list/page=${pageNumber}`,
  };

  return axiosAPI(config);
};

const requestGetProductById = async (shopId, productId) => {
  const config = {
    method: 'GET',
    url: `/shops/${shopId}/products/${productId}`,
  };

  return axiosAPI(config);
};

const requestChangeStatusProduct = async (id, data) => {
  const config = {
    method: 'PUT',
    url: `/admin/v1/products/${id}`,
    data,
  };

  return axiosAPI(config);
};

const requestCreateProductList = async (shopId, data) => {
  const config = {
    method: 'POST',
    url: `/shops/${shopId}/products/create_product_excel3`,
    data,
  };

  return axiosAPI(config);
};

const requestEditProduct = async (shopId, productId, data) => {
  const config = {
    method: 'PUT',
    url: `/shops/${shopId}/products/update_product/${productId}`,
    data,
  };

  return axiosAPI(config);
};

const requestCreateOneProduct = async (shopId, data) => {
  const config = {
    method: 'POST',
    url: `/shops/${shopId}/products/create_product`,
    data,
  };

  return axiosAPI(config);
};

const requestCreateOneProductDraff = async (shopId, data) => {
  const config = {
    method: 'POST',
    url: `/shops/${shopId}/products/create_product_draf`,
    data,
  };

  return axiosAPI(config);
};

const requestChangeProductImageToWhite = async (data) => {
  const config = {
    method: 'POST',
    url: `/crawl/process_image`,
    data,
  };

  return axiosAPI(config);
};

const requestRemoveProduct = async (shopId, data) => {
  const config = {
    method: 'POST',
    url: `/shops/${shopId}/products/delete_product`,
    data,
  };

  return axiosAPI(config);
};

export const products = {
  requestGetInfomationBoards,
  requestGetAllShop,
  requestGetInfoBoardById,
  requestGetAllProducts,
  requestGetProductById,
  requestChangeStatusProduct,
  requestCreateProductList,
  requestEditProduct,
  requestCreateOneProduct,
  requestCreateOneProductDraff,
  requestChangeProductImageToWhite,
  requestRemoveProduct,
};
