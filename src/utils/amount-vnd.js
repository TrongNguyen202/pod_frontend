export default function handleAmountFormat(value) {
  const number = typeof value === 'string' ? Number(value.replace(/\D/g, '')) : Number(value);

  if (isNaN(number)) return '0';

  return number.toLocaleString('vi-VN');
}
