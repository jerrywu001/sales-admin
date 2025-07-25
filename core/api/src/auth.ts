import Cookies from 'js-cookie';
import { ESystemType, StorageKeys } from '..';

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
  Cookies.remove(StorageKeys.systemTypeKey);
  Cookies.remove(StorageKeys.mockEnvSysTypeKey);
}

export function updateMockEnvSysType(type: number | string) {
  Cookies.set(StorageKeys.mockEnvSysTypeKey, String(type));
}

export function updateSysType(type: string) {
  updateMockEnvSysType(type);
  Cookies.set(StorageKeys.systemTypeKey, String(type));
}

export function getSysTypeValue() {
  return Cookies.get(StorageKeys.systemTypeKey);
}

export function getSystemTypeFromUrl(): ESystemType | undefined {
  const regex = /\/identity-([^/]+)/;
  const match = window.location.pathname.match(regex);

  if (!match[1]) return undefined;

  const s = {
    //
    saas: ESystemType.SAAS,
  };

  return s[match[1]];
}
