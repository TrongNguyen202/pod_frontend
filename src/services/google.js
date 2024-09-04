import { ENVIRONMENT_URL } from "src/constants";

const requestGetAlSheetInfo = async (range) => {
  const params = new URLSearchParams({
    key: ENVIRONMENT_URL.API_GOOGLE_KEY,
    majorDimension: "ROWS",
    valueRenderOption: "FORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
  }).toString();

  return axios({
    method: "GET",
    url: `${ENVIRONMENT_URL.API_GOOGLE_SHEETS}/${
      ENVIRONMENT_URL.SHEET_ID
    }/values/${range}${params ? `?${params}` : ""}`,
  });
};

const requestAddRowToSheet = async (range, data, oauthAccessToken) => {
  const params = new URLSearchParams({
    key: ENVIRONMENT_URL.API_GOOGLE_KEY,
    valueInputOption: "RAW",
  }).toString();

  const config = {
    method: "POST",
    body: JSON.stringify(data),
    url: `${ENVIRONMENT_URL.API_GOOGLE_SHEETS}/${
      c.SHEET_ID
    }/values/${range}:append${params ? `?${params}` : ""}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${oauthAccessToken}`,
    },
  };

  return axios(config);
};

export const google = {
  requestGetAlSheetInfo,
  requestAddRowToSheet,
};
