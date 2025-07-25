import { AxiosRequestConfig, AxiosResponseHeaders } from 'axios';

/**
 * Axios初始化配置
 */
export interface IAxiosConfig {
  /**
   * 是否使用interceptors检测身份认证逻辑
   * @see 若身份认证需要单独请求服务端，则每次请求时，另外还需要单独调用认证接口
   */
  useInterceptors?: boolean;
  /**
   * 是否toast服务器原始错误（不是我们理解的服务端自定义error）
   */
  toastOriginAxiosError?: boolean;
  /**
   * 传给axios的超时时间设置
   * @default undefined
   */
  timeout?: number;
}

/**
 * 请求返回通用定义（不同公司也许不一样）
*/
export interface IAxiosResponse<T = any> {
  /**
   * 返回数据结构
  */
  context: T;
  /**
   * 接口错误消息
  */
  message: string;
  /**
   * 接口状态码
  */
  code: EAxiosResponseCode | string | null;
  /** 
   * 响应头
   */
  headers?: AxiosResponseHeaders;
}

/**
 * Axios Response Code
 * @param OriginalSucceed '200'
 * @param Succeed '200'
 * @param Unauthorized '401'
 * @param Rejected '403'
 * @param NotFound '404'
 * @param TimeOut '408'
 * @param ServerError '500'
 */
export enum EAxiosResponseCode {
  /**
   * 服务器已成功处理了请求 (对应 原始stauts，不能修改)
   */
  OriginalSucceed = '200',
  /**
   * 服务器已成功处理了请求 (根据环境设定，有可能后端故意设置成替他code)
   */
  Succeed = '0',
  /**
   * 请求要求身份验证，对于需要登录的网页，服务器可能返回此响应
   */
  Unauthorized = '401',
  /**
   * 服务器已经理解请求，但是拒绝执行它。与401响应不同的是，身份验证并不能提供任何帮助，而且这个请求也不应该被重复提交。
   */
  Rejected = '403',
  /**
   * 请求失败，请求所希望得到的资源未被在服务器上发现
   */
  NotFound = '404',
  /**
   * 请求超时(可以根据需要去修改axios的超时时间)
   */
  TimeOut = '408',
  /**
   * 服务器异常
   */
  ServerError = '500',
}

/**
 * 传参类型（这往往要看后端怎么设计）
 * @param RequestPayload 对应Content-Type: application/json
 * @param FormData 对应Content-Type: application/x-www-form-urlencoded
 * @param MultipartFormData 对应Content-Type: multipart/form-data
 * @param TextPlain 对应Content-Type: text/plain
 */
export enum EParamsSendType {
  /**
   * 对应Content-Type: application/json
   */
  RequestPayload = 'RequestPayload',
  /**
   * 对应Content-Type: application/x-www-form-urlencoded
   */
  FormData = 'FormData',
  /**
   * 对应Content-Type: multipart/form-data
   */
  MultipartFormData = 'MultipartFormData',
  /**
   * 对应Content-Type: text/plain
   */
  TextPlain = 'TextPlain',
}

export const axiosPostContentType = {
  [EParamsSendType.RequestPayload]: 'application/json',
  [EParamsSendType.FormData]: 'application/x-www-form-urlencoded',
  [EParamsSendType.MultipartFormData]: 'multipart/form-data',
  [EParamsSendType.TextPlain]: 'text/plain',
};

/**
 * 请求配置
 * @extends [{@link AxiosRequestConfig}]
 */
export interface RequestConfig extends AxiosRequestConfig {
  /**
   * 是否需要登录
   * @default true
  */
  needLogin?: boolean;
  /**
   * post 传参类型
   */
  paramsSendType?: EParamsSendType;
}

/**
 * get http response error message
 */
export function getHttpErrorMessage(error: any) {
  return error?.message || error?.statusText
    || error?.body?.message || error?.body?.error
    || error?.response?.message || error.response?.error || '';
}
