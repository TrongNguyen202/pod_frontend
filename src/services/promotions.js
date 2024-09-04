import { axiosAPI } from "src/utils/axios";

const requestGetPromotions = async (
  id,
  pageNumber,
  searchValue = "",
  filterStatus = undefined
) => {
  const config = {
    method: "GET",
    url: `/shops/${id}/promotions?page_number=${pageNumber}&title=${searchValue}${
      filterStatus && filterStatus !== "all" ? `&status=${filterStatus}` : ""
    }`,
  };

  return axiosAPI(config);
};

const requestGetPromotionDetail = async (shopId, promotionId) => {
  const config = {
    method: "GET",
    url: `/shops/${shopId}/promotions/${promotionId}`,
  };

  return axiosAPI(config);
};

const requestCreatePromotion = async (shopId, data) => {
  const config = {
    method: "POST",
    url: `/shops/${shopId}/promotions/create_discount`,
    data,
  };

  return axiosAPI(config);
};

const requestDeactivatePromotion = async (shopId, data) => {
  const config = {
    method: "POST",
    url: `/shops/${shopId}/promotions/${promotionId}/deactivate`,
    data,
  };

  return axiosAPI(config);
};

const requestEditOrUpdatePromotion = async (id, data) => {
  const config = {
    method: "PATCH",
    url: `/admin/v1/promotions/${id}`,
    data,
  };

  return axiosAPI(config);
};

const requestListProductNoDiscount = async (shopId) => {
  const config = {
    method: "GET",
    url: `/shops/${shopId}/promotions/list_unpromotion`,
  };

  return axiosAPI(config);
};

const requestListProductNoFlashDeal = async (shopId) => {
  const config = {
    method: "GET",
    url: `/shops/${shopId}/promotions/list_unpromotion_sku`,
  };

  return axiosAPI(config);
};

const requestCreateFlashDeal = async (shopId, data) => {
  const config = {
    method: "POST",
    url: `/shops/${shopId}/promotions/create_flashsale`,
    data,
  };

  return axiosAPI(config);
};

const requestInactivePromotion = async (shopId, data) => {
  const config = {
    method: "POST",
    url: `/shops/${shopId}/promotions/deactive_promotion`,
    data,
  };

  return axiosAPI(config);
};

const requestPromotionDetail = async (shopId, promotionId) => {
  const config = {
    method: "GET",
    url: `/shops/${shopId}/promotions/${promotionId}/detail_promotion`,
  };

  return axiosAPI(config);
};

export const promotions = {
  requestGetPromotions,
  requestGetPromotionDetail,
  requestCreatePromotion,
  requestDeactivatePromotion,
  requestEditOrUpdatePromotion,
  requestListProductNoDiscount,
  requestListProductNoFlashDeal,
  requestCreateFlashDeal,
  requestInactivePromotion,
  requestPromotionDetail,
};
