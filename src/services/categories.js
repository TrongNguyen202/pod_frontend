import { axiosAPI } from "src/utils/axios";

const requestGetAllCategories = async () => {
  const config = {
    method: "GET",
    url: "/admin/v1/categories",
  };

  return axiosAPI(config);
};

const requestGetCategoriesById = async (id) => {
  const config = {
    method: "GET",
    url: `/shops/${id}/categories`,
  };

  return axiosAPI(config);
};

const requestGetAllCategoriesIsLeaf = () => {
  const config = {
    method: "GET",
    url: "/categories/global",
  };

  return axiosAPI(config);
};

const requestAllCategoriesIsLeafType2 = (id) => {
  const config = {
    method: "GET",
    url: `/shops/${id}/categories/is_leaf`,
  };

  return axiosAPI(config);
};

const requestGetCustomerById = (id) => {
  const config = {
    method: "GET",
    url: `/admin/v1/categories/${id}`,
  };

  return axiosAPI(config);
};

const requestGetAttributeByCategory = (shopId, categoryId) => {
  const config = {
    method: "GET",
    url: `/shops/${shopId}/categories/${categoryId}/products/get_attribute`,
  };

  return axiosAPI(config);
};

const requestRecommendCategory = (shopId, data) => {
  const config = {
    method: "POST",
    url: `/shops/${shopId}/category_recommend`,
    data,
  };

  return axiosAPI(config);
};

export const categories = {
  requestGetAllCategories,
  requestGetCategoriesById,
  requestGetAllCategoriesIsLeaf,
  requestAllCategoriesIsLeafType2,
  requestGetCustomerById,
  requestGetAttributeByCategory,
  requestRecommendCategory,
};
