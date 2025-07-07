/* eslint-disable no-useless-escape */
// export const getMeta = (metaName) => {
//   const metas = document.getElementsByTagName("meta");
//   for (let i = 0; i < metas.length; i++) {
//     if (metas[i].getAttribute("name") === metaName) {
//       return metas[i].getAttribute("content");
//     }
//   }
//   return "";
// };

import dayjs from 'dayjs';
import { isArray } from 'lodash';
import utc from 'dayjs/plugin/utc';
import { categoryList, standardizationCategory } from 'src/constants';

dayjs.extend(utc);

// export const store_code =
//   getMeta("store_code") === ""
//     ? window.location.hostname.split(".")[0]
//     : getMeta("store_code");

export const formatNumber = (str) => {
  if (str === undefined || str === null) return '';
  const strFormat = str.toString().replace(/[A-Za-z`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
  if (Number(strFormat) >= 1000) {
    return strFormat
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : `${next}.`) + prev;
      });
  }
  if (Number(strFormat) >= 0 && Number(strFormat) < 1000) {
    return Number(strFormat);
  }
  return '';
};

export const getCategoryCounts = (role, statusCountMap = {}) => {
  const visibleCategories = categoryList.filter((label) => {
    if (role === 'designer' && label === 'DRAFT') return false;
    if (role === 'customer' && label === 'ARCHIVED') return false;
    return true;
  });

  return visibleCategories.map((label) => {
    const count =
      label === 'ALL' ? Object.values(statusCountMap).reduce((sum, val) => sum + val, 0) : statusCountMap[label] || 0;

    return {
      label: formatCategoryLabel(label),
      value: label,
      count,
    };
  });
};

export const formatCategoryLabel = (label) => standardizationCategory[label];

export const getAllowedStatusOptions = (role, currentStatuses) => {
  if (currentStatuses.length !== 1) return [];

  const status = currentStatuses[0];

  const transitions = {
    customer: {
      DRAFT: ['NEW'],
      IN_REVIEW: ['NEED_FIX', 'DONE'],
    },
    designer: {
      NEW: ['DOING'],
      DOING: ['IN_REVIEW'],
      NEED_FIX: ['IN_REVIEW'],
    },
  };

  return transitions[role]?.[status] || [];
};

export const checkRole = (role) => {
  return {
    isAdmin: role === 'admin',
    isDesigner: role === 'designer',
    isCustomer: role === 'customer',
  };
};

export const transformBoardToFormInitialData = (boardInfoData) => ({
  title: boardInfoData.title || '',
  designType: boardInfoData.designType?.toUpperCase() || '',
  productTypeIds: Array.isArray(boardInfoData.productTypeIds)
    ? boardInfoData.productTypeIds.filter((id) => id != null).map(Number)
    : [],
});

// Hàm tính toán thời gian thanh toán theo block
export const calculatePaymentTime = (completedTimestamp, status) => {
  // Chuyển đổi timestamp sang Date object
  const completedDate = new Date(completedTimestamp);

  // Tạo ngày thanh toán (sau 2 ngày)
  const paymentDate = new Date(completedDate);
  if (status === 'DONE') {
    paymentDate.setDate(paymentDate.getDate() + 2);
    // Tạo ngày hoan thanh (sau 3 ngày)
  } else if (status === 'IN_REVIEW') {
    paymentDate.setDate(paymentDate.getDate() + 3);
  }

  // Lấy giờ hiện tại của ngày thanh toán
  const currentHour = paymentDate.getHours();

  // Xác định block thời gian tiếp theo
  let paymentHour;
  if (currentHour < 6) {
    paymentHour = 6;
  } else if (currentHour < 12) {
    paymentHour = 12;
  } else if (currentHour < 18) {
    paymentHour = 18;
  } else {
    // Nếu >= 18h thì chuyển sang ngày hôm sau lúc 0h
    paymentDate.setDate(paymentDate.getDate() + 1);
    paymentHour = 0;
  }

  // Set giờ chính xác
  paymentDate.setHours(paymentHour, 0, 0, 0);

  return paymentDate;
};

// Hàm format thời gian hiển thị
export const formatPaymentTime = (date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, '0');

  return `${day}/${month}/${year} lúc ${hour}:00`;
};

export const formatPriceOrContact = (p) => {
  if (!p) return 'Liên hệ';
  p = Math.round(p);
  p = p.toString();
  let n = 0;
  let tmp = '';
  let rs = p[0];
  for (let i = p.length - 1; i > 0; i--) {
    n++;
    tmp += p[i];
    if (n % 3 === 0) {
      tmp += '.';
    }
  }
  for (let i = tmp.length - 1; i >= 0; i--) {
    rs += tmp[i];
  }
  if (rs === 0) return 'Liên hệ';
  return `₫${rs}`;
};

export const formatPrice = (p, NOD = false) => {
  if (!p) return '0';
  p = Math.round(p);
  p = p.toString();
  let n = 0;
  let tmp = '';
  let rs = p[0];
  for (let i = p.length - 1; i > 0; i--) {
    n++;
    tmp += p[i];
    if (n % 3 === 0) {
      tmp += '.';
    }
  }
  for (let i = tmp.length - 1; i >= 0; i--) {
    rs += tmp[i];
  }
  if (NOD === true) return rs;
  return `₫${rs}`;
};

export const getQueryParams = (name) => {
  return new URLSearchParams(window ? window.location.search : {}).get(name);
};

export const getPathByIndex = (index) => {
  const path = window.location.pathname;
  const parts = path.split('/');

  if (index >= 0 && index < parts.length) {
    return parts[index];
  }
  return null;
};

export const contactOrNumber = (data) => {
  if (getChannel() === 'IKIPOS') {
    return data;
  }
  const string = data.slice(0, -2);
  const newString = string
    .toString()
    .replace(/\./g, '')
    .toString()
    .replace(/,/g, '')
    .toString()
    .replace(/-/g, '')
    .toString();
  if (newString === '0') {
    return '0đ';
  }
  return data;
};

export const getChannel = () => {
  if (window.location.href.includes('pos.')) {
    return 'IKIPOS';
  }
  return 'IKITECH';
};

export const format = (number) => {
  const num = Number(number);
  return num.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};

// style: currency, percent
export const IntlNumberFormat = (currency, style, maximumSignificantDigits, number) => {
  return new Intl.NumberFormat(currency, {
    style: `${style}`,
    currency: `${currency}`,
    maximumSignificantDigits: `${maximumSignificantDigits}`,
  }).format(number);
};

export function getCurrencySymbol(locale, currency) {
  return (0)
    .toLocaleString(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, '')
    .trim();
}

export const buildNestedArrays = (items, parentId) => {
  let nestedItems = [];
  if (items) {
    nestedItems = items.filter((item) => item.parent_id === parentId);
  }

  return nestedItems.map((item) => ({
    title: item.local_display_name,
    value: item.id,
    key: item.id,
    children: buildNestedArrays(items, item.id),
  }));
};

export const buildNestedArraysMenu = (items) => {
  const itemsByParentId = items.reduce((acc, item) => {
    if (!acc[item.parent_id]) {
      acc[item.parent_id] = [];
    }
    acc[item.parent_id].push(item);
    return acc;
  }, {});

  const buildTree = (parentId) => {
    const children = itemsByParentId[parentId];
    if (!children) {
      return null;
    }
    return children.map((item) => {
      const grandChildren = buildTree(item.id);
      return grandChildren
        ? {
            label: item.local_name,
            key: item.id,
            children: grandChildren,
            value: item.id,
          }
        : { label: item.local_name, key: item.id, value: item.id };
    });
  };

  return buildTree(0);
};

export const removeDuplicates = (array, keySelector) => {
  const cachedObject = {};
  array.forEach((item) => (cachedObject[item[keySelector]] = item));
  array = Object.values(cachedObject);
  return array;
};

export const flatMapArray = (array1, array2) => {
  return array1.flatMap((item1) =>
    array2.map((item2) => ({
      data: [{ value_name: item1 }, { value_name: item2 }],
    })),
  );
};

export const convertProductAttribute = (product_attributes) => {
  const newAttributes =
    product_attributes &&
    Object.entries(product_attributes).map(([id, values]) => ({
      id,
      values,
    }));

  const newAttributeConvert = newAttributes?.filter((item) => item.values);

  if (!newAttributeConvert) return [];
  return newAttributeConvert.map((item) => ({
    attribute_id: item.id,
    attribute_values: isArray(item.values)
      ? item.values.map((value) => ({
          value_id: value?.id,
          value_name: value?.name,
        }))
      : [{ value_id: item.values?.id, value_name: item.values?.name }],
  }));
};

const now = dayjs();

export const START_OF_DAY = dayjs.utc(now).startOf('day').unix();

export const START_OF_TOMORROW = dayjs.utc(now).startOf('day').add(1, 'day').unix();

export const END_OF_DAY = dayjs.utc(now).endOf('day').unix();
