import { getCosFileName } from '@core/tools';
import { Http } from './axios-request/Axios';
import { EAxiosResponseCode, getHttpErrorMessage } from './axios-request/IAxiosRequest';
import Cookies from 'js-cookie';
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

export enum ESystemType {
  /** SAAS */
  SAAS = 0,
}

export const systemTypeKey = {
  // 空
  [ESystemType.SAAS]: 'saas',
};

export const getSuffixName = () => {
  const a = Number(Cookies.get(StorageKeys.systemTypeKey)) as ESystemType;

  const suffix = {
    // 主应用后缀
    [ESystemType.SAAS]: '平台',
  }[a];

  return suffix ? `-${suffix}` : '';
};

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

export const StorageKeys = {
  /**
   * @description token key
   */
  TokenKey: 'PLATFORM-TOKEN',
  systemTypeKey: 'systemType',
  /** sidebar collapse storage key */
  sidebarCollapseKey: 'sidebar-collapse',
  mockEnvSysTypeKey: 'mockEnvSysType',
};
