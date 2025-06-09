import { axiosAPI } from "src/utils/axios";

// const requestGetAllBanner = async () => {
//   const config = {
//     method: "GET",
//     url: "/groups/user_login_infor",
//   };

//   return axiosAPI(config);
// };

const requestCreateBanner = async (data) => {
  const config = {
    method: "POST",
    url: "/admin/v1/banner_webad",
    data: data,
  };

  return axiosAPI(config);
};

const requestDeleteBanner = async (id) => {
  const config = {
    method: "DELETE",
    url: `/admin/v1/banner_webad/${id}`,
  };

  return axiosAPI(config);
};

const requestUpdateBanner = async (id) => {
  const config = {
    method: "PUT",
    url: `/admin/v1/banner_webad/${id}`,
  };

  return axiosAPI(config);
};

const requestGetBannerById = async (id) => {
  const config = {
    method: "GET",
    url: `/admin/v1/banner_webad/${id}`,
  };

  return axiosAPI(config);
};

export const bannersAds = {
  // requestGetAllBanner,
  requestCreateBanner,
  requestDeleteBanner,
  requestUpdateBanner,
  requestGetBannerById,
};
