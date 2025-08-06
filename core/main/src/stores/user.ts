import { doLogout, getToken, removeToken } from '@core/api';
import { Message } from '@arco-design/web-vue';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useUserStore = defineStore('user-store', () => {
  const state = reactive({
    /** 用户名 */
    name: '',
    /** 手机号 */
    phone: '',
    /** 是否禁用 1启用、0禁用 */
    enabled: 1 as 0 | 1,
    /** auth token */
    token: getToken(),
    /** 按钮权限编码 */
    permissions: [] as string[],
    /** 快捷入口 */
    entrances: [] as string[],
  });

  function updateToken(token: string) {
    state.token = token;
  }

  function updatePermissions(roles: string[]) {
    state.permissions = roles || [];
  }

  function updateEntrances(entrances: string[]) {
    state.entrances = entrances || [];
  }

  async function logout() {
    try {
      const errorMsg = await doLogout();

      if (!errorMsg) {
        afterLogout();
      } else {
        Message.error(errorMsg);
      }
    } catch (error) {
      Message.error((error as Error).message);
    }
  }

  function afterLogout() { // TODO
    const redirectPath = '/login';

    updateToken('');
    updatePermissions([]);
    removeToken();

    if (__ENV_DEV__) {
      window.location.href = `${location.protocol}//${location.hostname}:${__LOGIN_APP_PORT__}${redirectPath}`;
    } else {
      console.log('to Login Page from hooks');
      window.location.href = redirectPath;
    }
  }

  return {
    state,
    logout,
    afterLogout,
    updateToken,
    /** 更新按钮权限编码 */
    updatePermissions,
    /** 更新快捷入口 */
    updateEntrances,
  };
});

export default useUserStore;
