const { axiosAPIPrintCare } = require("src/utils/axios");

const requestLoginPrintCare = async (data) => {
  const config = {
    method: "POST",
    url: `integration/customer/token`,
    data,
  };

  return axiosAPIPrintCare(config);
};

export const printCare = {
  requestLoginPrintCare,
};
