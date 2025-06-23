import moment from 'moment';

export const formatDate = (date, format) => {
  const formattedDate = moment(date).format(format);
  return formattedDate;
};

export const formatGMT = (date) => {
  const formattedGMT = moment(date).toDate();
  return formattedGMT;
};

// chuyển đổi timestamp sang ngày tháng năm dạng DD/MM/YY, h:mm:ss
export const formatDateTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const formatted = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  return formatted;
};

export const formatMiliToDateTime = (timestamp) => {
  const date = new Date(timestamp);

  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  const formatted = `${hh}:${mm} ${dd}-${month}-${yyyy}`;
  return formatted;
};
