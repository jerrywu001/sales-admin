import { getCosFileName } from '@core/tools';
import { Http } from './axios-request/Axios';
import { EAxiosResponseCode, getHttpErrorMessage } from './axios-request/IAxiosRequest';
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

export const StorageKeys = {
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
