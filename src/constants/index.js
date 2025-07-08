export const LOCAL_STORAGE_KEY = {
  ACCESS_TOKEN: 'tk-tk',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_PRINT_CARE: 'print-care-tk',
  TOKEN_FLASH_SHIP: 'flash-ship-tk',
  USER_NAME: 'usernamecurrent',
  USER_ID: 'uid',
  USER_ROLE: 'role',
  USER_IP: 'ipAdrress',
  USER_AGENT: 'userAgent',
  DEVICE_ID: 'deviceId',
  USER_EMAIL: 'email',
};

export const categoryList = [
  'DRAFT',
  'NEW',
  // 'TODO',
  'DOING',
  // 'CHECK',
  'IN_REVIEW',
  'NEED_FIX',
  'DONE',
  'ARCHIVED',
  'ALL',
];

export const standardizationCategory = {
  DRAFT: 'Nháp',
  NEW: 'Mới',
  DOING: 'Đang xử lý',
  IN_REVIEW: 'Kiểm tra',
  NEED_FIX: 'Cần sửa',
  DONE: 'Hoàn thành',
  ARCHIVED: 'Lưu trữ ',
  ALL: 'Tất cả',
};

export const validNextStatusMap = {
  DRAFT: ['NEW'],
  NEW: ['DOING'],
  // TODO: ['DOING'],
  DOING: ['IN_REVIEW'],
  // CHECK: ['IN_REVIEW'],
  IN_REVIEW: ['NEED_FIX', 'DONE'],
  NEED_FIX: ['IN_REVIEW'],
  DONE: ['ARCHIVED'],
};

export const categoryColors = {
  DRAFT: '#90caf9',
  NEW: '#a5d6a7',
  TODO: '#ffcc80',
  DOING: '#ffab91',
  CHECK: '#ce93d8',
  IN_REVIEW: '#80cbc4',
  NEED_FIX: '#f48fb1',
  DONE: '#b39ddb',
  ARCHIVED: '#721387',
  ALL: '#i66sd5',
};

export const categoryLabelsVi = {
  NEW: 'Tạo mới',
  RE_DESIGN: 'Thiết kế lại',
  CLONE: 'Tạo bản sao',
};

export const categoryStatusVi = {
  DRAFT: 'Nháp',
  NEW: 'Mới',
  DOING: 'Nhận đơn',
  IN_REVIEW: 'Kiểm tra',
  NEED_FIX: 'Cần sửa',
  DONE: 'Hoàn thành',
  ARCHIVED: 'Lưu trữ ',
};

export const categoryStatusViU = {
  DRAFT: 'Nháp',
  NEW: 'Mới',
  DOING: 'Đang xử lý',
  IN_REVIEW: 'Kiểm tra',
  NEED_FIX: 'Cần sửa',
  DONE: 'Hoàn thành',
  ARCHIVED: 'Lưu trữ ',
};

export const optionsDesignType = [
  { label: 'CLONE', value: 'CLONE' },
  { label: 'RE_DESIGN', value: 'RE_DESIGN' },
  { label: 'NEW', value: 'NEW' },
];

export const bankId = 'mbbank';
export const bankAccountNo = '0399709507';

export const PRICE_OPTIONS = [
  { id: 1, label: '20,000', value: 20000 },
  { id: 2, label: '25,000', value: 25000 },
  { id: 3, label: '27,000', value: 27000 },
  { id: 4, label: '32,000', value: 32000 },
  { id: 5, label: '35,000', value: 35000 },
];

// tách theo designType
export const PRICE_OPTIONS_BY_DESIGN_TYPE = {
  CLONE: [
    { id: 1, label: '27,000', value: 27000 },
    { id: 2, label: '35,000', value: 35000 },
    { id: 3, label: '45,000', value: 45000 },
    { id: 4, label: '54,000', value: 54000 },

  ],
  RE_DESIGN: [
    { id: 5, label: '40,500', value: 40500 },
    { id: 6, label: '52,500', value: 52500 },
    { id: 7, label: '67,500', value: 67500 },
    { id: 8, label: '81,000', value: 81000 },
  ],
  NEW: [
    { id: 9, label: '135,000', value: 135000 },
    { id: 10, label: '175,000', value: 175000 },
    { id: 11, label: '225,000', value: 225000 },
    { id: 12, label: '270,000', value: 270000 },

  ],
};

const allowedTypes = [
  { type: 'image/jpeg', exts: ['.jpg', '.jpeg'] },
  { type: 'image/png', exts: ['.png'] },
  { type: 'image/gif', exts: ['.gif'] },
  { type: 'image/webp', exts: ['.webp'] },
  { type: 'image/bmp', exts: ['.bmp'] },
  { type: 'image/svg+xml', exts: ['.svg'] },
  { type: 'image/heic', exts: ['.heic'] },
  { type: 'image/tiff', exts: ['.tiff', '.tif'] },
  { type: 'image/x-icon', exts: ['.ico'] },
  { type: 'image/avif', exts: ['.avif'] },
];

export function isValidImage(file) {
  const ext = file.name.toLowerCase();
  return allowedTypes.some(({ type, exts }) =>
    file.type === type && exts.some((e) => ext.endsWith(e))
  );
}

export const permission = {
  ADMIN: 0, // Admin
  CUSTOMER: 1, // Customer
  DESIGNER: 2, // Designer
};
