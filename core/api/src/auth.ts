import Cookies from 'js-cookie';
import { StorageKeys } from '..';

const tokenCookieExpires = 1;

export function getToken() {
  return Cookies.get(StorageKeys.TokenKey);
}

export function setToken(token: string, rememberMe = 0) {
  if (rememberMe) {
    Cookies.set(StorageKeys.TokenKey, token, { expires: tokenCookieExpires });
    return;
  }

  Cookies.set(StorageKeys.TokenKey, token);
}

export function removeToken() {
  Cookies.remove(StorageKeys.TokenKey);
  Cookies.remove(StorageKeys.mockEnvSysTypeKey);
}
