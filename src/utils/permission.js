import { permission } from '../constants';

export const hasManagerPermission = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !Array.isArray(user.role)) return false;
  if (user.role[0] === permission.ADMIN) return true;
  return false;
};

export const hasSellerPermission = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !Array.isArray(user.role)) return false;
  if (user.role[0] === permission.CUSTOMER) return true;
  return false;
};

export const hasDesignerPermission = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !Array.isArray(user.role)) return false;
  if (user.role[0] === permission.DESIGNER) return true;
  return false;
};
