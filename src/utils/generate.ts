export default function generateTransactionCode(length = 10, userId) {
  // abcdefghijklmnopqrstuvwxyz
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < length; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'SDN' + userId + randomPart;
}
