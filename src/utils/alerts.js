import { toast } from 'react-toastify';

const success = (message) => {
  toast.success(message, {
    delay: 0,
  });
};
const error = (message) => {
  toast.error(message, {
    delay: 0,
  });
};
const warning = (message) => {
  toast(message, {
    icon: '⚠️',
  });
};
export const alerts = {
  success,
  error,
  warning,
};
