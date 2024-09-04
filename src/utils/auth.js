export var Issuer;
(function (Issuer) {
  Issuer['Auth0'] = 'Auth0';
  Issuer['Firebase'] = 'Firebase';
  Issuer['JWT'] = 'JWT';
  Issuer['Amplify'] = 'Amplify';
})(Issuer || (Issuer = {}));

export function setTokenExpand(tokenKey, token, expirationTime) {
  const currentTime = Date.now();
  const expireAt = currentTime + expirationTime;
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(`${tokenKey}-expiration`, expireAt);
}

export function removeExpiredTokens() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const keys = Object.keys(localStorage);
    const currentTime = Date.now();

    keys.forEach((key) => {
      if (key.endsWith('-expiration')) {
        const tokenKey = key.replace('-expiration', '');
        const expirationTime = localStorage.getItem(key);
        if (expirationTime && currentTime > parseInt(expirationTime)) {
          localStorage.removeItem(tokenKey);
          localStorage.removeItem(key);
        }
      }
    });
  }
}

removeExpiredTokens();

export const removeStorages = () => {
  localStorage.removeItem('tk-tk');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('productList');
  localStorage.removeItem('isWhitelist');
  localStorage.removeItem('licenseCode');
};
