import { axiosAPI } from "src/utils/axios";

const requestLogin = async (data) => {
  const config = {
    method: "POST",
    url: "/login",
    data: data,
  };

  return axiosAPI(config);
};

const requestRegister = async (data) => {
  const config = {
    method: "POST",
    url: "/register",
    data: data,
  };

  return axiosAPI(config);
};

const requestCheckExits = async (data) => {
  const config = {
    method: "POST",
    url: "/login/check_exists",
    data: data,
  };

  return axiosAPI(config);
};

const requestResetPassword = async (data) => {
  const config = {
    method: "POST",
    url: "/reset_password",
    data: data,
  };

  return axiosAPI(config);
};

const requestSendOtp = async (data) => {
  const config = {
    method: "POST",
    url: "/send_otp",
    data: data,
  };

  return axiosAPI(config);
};

const requestSendMailOtp = async (data) => {
  const config = {
    method: "POST",
    url: "/send_email_otp",
    data: data,
  };

  return axiosAPI(config);
};
// const requestGetProfileInfor = async () => {
//   const config = {
//     method: "GET",
//     url: "/groups/user_login_infor",
//   };

//   return axiosAPI(config);
// };

export const auth = {
  requestLogin,
  requestCheckExits,
  // requestGetProfileInfor,
  requestRegister,
  requestResetPassword,
  requestSendMailOtp,
  requestSendOtp,
};
