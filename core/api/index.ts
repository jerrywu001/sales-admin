import { generateRandomString, getCosFileName } from '@core/tools';
import { Http } from './axios-request/Axios';
import { Message } from '@arco-design/web-vue';
import { EAxiosResponseCode, getHttpErrorMessage } from './axios-request/IAxiosRequest';
import { removeToken, setSecureState } from './src/auth';
export * from './src/auth';

export * from './src/common';

export * from './src/login';

export * from './axios-request/Axios';
export * from './axios-request/AxiosRequest';
export * from './axios-request/IAxiosRequest';

export interface ITopMenu {
  name: string;
  /** 路由名称(用于跳转) */
  routeName?: string;
  /** menu名称 */
  label: string;
  /** menu icon */
  icon: string;
}

export interface ISidebarMenu {
  /** 路由名称 */
  name: string;
  /**
   * 组件路径
  */
  component?: string;
  /**
   * 路由layout
   * @default 'default'
   */
  layout?: 'default' | 'normal' | 'blank';
  /**
   * 路由重定向地址
   * @default undefined
   */
  redirect?: string;
  /** 路由meta */
  meta: {
    /** 父节点name */
    parentName?: string;
    /** 路由对应的document.title */
    title: string;
    /**
     * icon class name
     * @default ''
     * @description 可以去 https://icon-sets.iconify.design/ 搜索
     */
    icon?: string;
    /**
     * 路由组件使用缓存？
     * @default false
     *
     * @description link值不为空时，缓存将失效
    */
    cache?: boolean;
    /** 外部链接，通过ifrmae加载 */
    link?: string;
  };
  /**
   * 路由是否隐藏？
   * @default true
   */
  hidden?: boolean;
  isThird?: boolean;
  children?: ISidebarMenu[];
}

/**
 * 空中分账 - 分账管理 - 收款方管理
 */
export async function downloadLinkFile(fileUrl: string) {
  try {
    const { code, message, context: blob } = await Http.get<any>(fileUrl, { }, { responseType: 'blob' });

    if (code === EAxiosResponseCode.Succeed) {
      const link = document.createElement('a');

      link.href = window.URL.createObjectURL(blob);
      link.download = getCosFileName(fileUrl) || '';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      throw new Error(message || '服务器异常，下载失败~');
    }
  } catch (error) {
    throw new Error(getHttpErrorMessage(error));
  }
}

/**
 * get clientId by host TODO
 */
export async function queryClientIdByHost() {
  let clientId = '';
  let errMsg = '';

  const { host } = location;
  const hostUrl = getHostbaseUrl();

  try {
    const { code, context, message } = await Http.get<string>(
      `${hostUrl}/iam/get-client-id`, { host },
    );

    if (code === EAxiosResponseCode.Succeed) {
      clientId = context || '';
    } else if (message) {
      errMsg = message;
    }
  } catch (error) {
    errMsg = getHttpErrorMessage(error);
  }

  return {
    clientId,
    errMsg,
  };
}

export async function toOauthAPI() {
  const { href } = location;
  const [path, search] = href.split('?');
  const uuid = generateRandomString();

  const { clientId, errMsg } = await queryClientIdByHost();

  if (errMsg) return Message.error(errMsg);

  const redirectUrl = encodeURIComponent(path + (search ? `?${search}` : ''));
  const oauth2Path = `oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&state=${uuid}`;

  removeToken();
  setSecureState(uuid);

  window.location.href = `${getOuathHost()}/${oauth2Path}`;
}

export const APIHostMap = {
  small: 'http://192.168.2.101:5001',
  test: 'https://getway.upfreework.com',
  uat: 'https://gateway-uat.upfreework.com',
  prod: 'https://getway.ninghuoban.com',
};

export const getAPIHost = () => {
  // TODO: 部署后接口host是否和网站域名一致，待定！
  // return `${location.protocol}//${location.host}`;
  return APIHostMap[__API_ENV__ as keyof typeof APIHostMap];
};

export function getHostbaseUrl(): string {
  if (__ENABLE_DEV_MOCK__ || __MOCK_PROD__) {
    return `${location.protocol}//${location.hostname}:${location.port || 80}/mock`;
  }

  // 打包后的服务器环境
  if (!__ENV_DEV__) {
    return APIHostMap[__API_ENV__ as keyof typeof APIHostMap];
  }

  // 本地run dev开发（走vite proxy配置）
  return `${location.protocol}//${location.hostname}:${location.port}`;
}

export const oauthMockHost = 'http://localhost:3009';

export function getOuathHost() {
  const hostEnv = __API_ENV__;

  if (__ENABLE_DEV_MOCK__ || __MOCK_PROD__) {
    return oauthMockHost;
  }

  // TODO: oauth2域名待定
  switch (hostEnv) {
    case 'small':
      return 'http://192.168.2.101:5001';
    case 'test':
      return 'https://oauth2.upfreework.com';
    case 'uat':
      return 'https://oauth2-uat.upfreework.com';
    case 'prod':
      return 'https://oauth2.ninghuoban.com';

    default:
      break;
  }
}

export const StorageKeys = {
  /** 防止重刷 */
  SecureState: 'SecureState',
  /**
   * @description token key
   */
  TokenKey: 'PLATFORM-TOKEN',
  /** sidebar collapse storage key */
  sidebarCollapseKey: 'sidebar-collapse',
  mockEnvSysTypeKey: 'mockEnvSysType',
};

export enum ESmsType {
  /** 登录 */
  Login = 9,
  /** 修改密码 */
  EditPass = 1,
  /** 修改手机号（原手机号） */
  OldEditPhone = 2,
  /** 修改手机号(新手机号) */
  EditPhone = 3,
  /** 找回密码 */
  FindPass = 0,
  /** 修改支付密码 */
  UpdatePayPwd = 11,
  /** 修改支付手机号(原来) */
  UpdatePayPhoneOld = 12,
  /** 修改支付手机号(新) */
  UpdatePayPhoneNew = 13,
  /** 支付发送验证码 */
  SplitBill = 14,
  /** 企业降级 */
  DowngradeCompany = 15,
  /** 集团-企业解绑 */
  UnBindCompany = 16,
  /** 内部转账 */
  InternalTransfer = 18,
}

export function logEnvInfo() {
  const red = (str) => {
    console.log(`%c${str}`, 'color: red');
  };

  const blue = (str) => {
    console.log(`%c${str}`, 'color: blue');
  };

  blue(`本地开发环境？ ${__ENV_DEV__ ? '是' : '否'}，版本：${__VERSION__}，最后构建时间：${__BUILDDATE__}`);

  red(`接口HOST：${getHostbaseUrl()}`);

  if (__ENABLE_DEV_MOCK__ || __MOCK_PROD__) red('当前环境已开启mock服务');
}

export function getH5BaseUrl() {
  switch (getHostbaseUrl()) {
    /** 测试 */
    case 'https://getway.upfreework.com':
      return 'https://acc-h5.upfreework.com';
    /** UAT */
    case 'https://gateway-uat.upfreework.com':
      return 'https://acc-uat-h5.upfreework.com';
    /** 101 */
    case 'http://218.94.156.194:5001':
      return 'http://192.168.2.101:5002';
    case 'http://192.168.2.101:5001':
      return 'http://192.168.2.101:5002';
    /** 生产 */
    case 'https://getway.ninghuoban.com':
      return 'https://h5.ninghuoban.com';
    /** 其他*/
    default:
      return 'https://acc-h5.upfreework.com';
  }
}
