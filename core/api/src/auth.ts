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

export function getSecureState() {
  return sessionStorage.getItem(StorageKeys.SecureState);
}

export function setSecureState(uuid: string) {
  sessionStorage.setItem(StorageKeys.SecureState, uuid);
}

export function removeSecureState() {
  sessionStorage.removeItem(StorageKeys.SecureState);
}

export function removeToken() {
  Cookies.remove(StorageKeys.TokenKey);
  Cookies.remove(StorageKeys.mockEnvSysTypeKey);
  sessionStorage.removeItem(StorageKeys.SecureState);
}
