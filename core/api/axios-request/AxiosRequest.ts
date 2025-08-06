import axios, { AxiosError, AxiosPromise, AxiosResponse } from 'axios';
import { getToken, removeToken } from '../src/auth';
import {
  EAxiosResponseCode,
  getHttpErrorMessage,
  IAxiosConfig,
  IAxiosResponse,
  RequestConfig,
} from './IAxiosRequest';
import { Message } from '@arco-design/web-vue';
import { isNull } from '@core/tools';

const defaultTimeout = 200000;

/**
 * axios default config
 */
function initAxiosConfig(timeout = defaultTimeout) {
  axios.defaults.timeout = timeout;
  axios.defaults.timeoutErrorMessage = '请求超时';

  // 跨域是否允许携带凭证
  axios.defaults.withCredentials = false;

  // 默认设置为 EParamsSendType.RequestPayload 模式
  axios.defaults.headers['Content-Type'] = 'application/json';
}

/**
 * 接口请求封装类
 * @see 关于接口调用时，检测身份认证逻辑，请参照useInterceptors变量
 */
export class AxiosRequest {
  /**
   * 是否使用interceptors检测身份认证逻辑
   * @see 若身份认证需要单独请求服务端，则每次请求时，另外还需要单独调用认证接口
   */
  static useInterceptors = true;

  /**
   * 是否toast服务器原始错误（不是我们理解的服务端自定义error）
   */
  static toastOriginAxiosError = false;

  /**
   * Axios初始化
   * @param config【IAxiosConfig】 Axios初始化配置
   */
  static init(axiosConfig = {} as IAxiosConfig) {
    initAxiosConfig(axiosConfig.timeout);

    AxiosRequest.toastOriginAxiosError = axiosConfig.toastOriginAxiosError ?? false;
    AxiosRequest.useInterceptors = axiosConfig?.useInterceptors ?? true;

    if (AxiosRequest.useInterceptors) {
      AxiosRequest.setResponseInterceptors();
    }
  }

  /**
   * get 方法
   * @param url 接口地址
   * @param query get 对应的query
   * @param opts request-config [{@link RequestConfig}]
   */
  static async common<T>(config = {} as RequestConfig) {
    let res = {} as AxiosResponse<IAxiosResponse<T>>;

    try {
      const handler: AxiosPromise<IAxiosResponse<T>> = axios(config);

      res = await handler;
      if (res && 'status' in res) {
        res.data = res.data || {} as IAxiosResponse<T>;
        if (!res.data) {
          printErrorMsg('未能接收到服务器返回的数据，请检查是否跨域或重定向');
        } else if (!isNull(res.data.code)) {
          res.data.code = String(res.data.code) as EAxiosResponseCode;
          if (res.data.message && res.data.code !== EAxiosResponseCode.Succeed) {
            console.error(`接口返回异常： ${config.url}: `, res.data.message);
          }
        } else if (typeof res.data === 'string' || res.data instanceof Blob) {
          res.data = {
            code: EAxiosResponseCode.Succeed,
            message: null,
            // @ts-ignore
            context: res.data,
            headers: res.headers,
          };
        } else {
          console.error('response -> code 未配置');
        }
      } else {
        res = {
          status: Number(EAxiosResponseCode.TimeOut),
          data: {},
        } as AxiosResponse<IAxiosResponse<T>>;
      }
    } catch (error) {
      // axois error handler
      const theError = error as AxiosError;
      let theCode = '-1';
      let message = getHttpErrorMessage(theError);

      res.data = res.data || {} as IAxiosResponse<T>;
      if (theError) {
        if (['ETIMEDOUT', 'ECONNABORTED'].includes(theError.code)) {
          theCode = EAxiosResponseCode.TimeOut;
          message = axios.defaults.timeoutErrorMessage;
        }
        res.status = Number(theCode);
        printErrorMsg(message);
      }
    }
    // original error handler
    const originalCode = (res?.status || -1).toString();

    if (originalCode !== EAxiosResponseCode.OriginalSucceed) {
      if (originalCode === EAxiosResponseCode.TimeOut) {
        res.data.code = EAxiosResponseCode.TimeOut;
        res.data.message = axios.defaults.timeoutErrorMessage;
        console.error('请求超时，请查看您的axios设置', axios.defaults);
      } else {
        res.data.code = String(res.status || '-1');
        printErrorMsg(res.statusText || '服务器异常，请稍后再试');
      }
    }
    return res.data;
  }

  /**
   * 设置请求响应拦截器
   */
  static setResponseInterceptors() {
    axios.interceptors.response.use(
      (response) => {
        const { config = {}, data, status } = response;

        const code = Number(!data ? -1 : data?.code ?? EAxiosResponseCode.Succeed);

        if (status.toString() !== EAxiosResponseCode.OriginalSucceed) {
          resolveHttpStatus(status, config.url);
        } else if (code.toString() !== EAxiosResponseCode.Succeed) {
        // 后端状态处理
          resolveHttpStatus(code, config.url);
        }
        return response;
      }, (error) => {
        const response = error.response as any;

        if (!response) {
          return;
        }
        const config = response.config;

        logError(`${getHttpErrorMessage(error)}：${config?.url}`);
        resolveHttpStatus(response.status, config?.url);
      },
    );

    axios.interceptors.request.use(
      (config) => {
        if (getToken()) {
          config.headers.Authorization = `Bearer ${getToken()}`;
        }
        // config.headers['X-Developer-ID'] = 'sh';
        return config;
      }, (error) => {
        console.error(error);
      },
    );
  }
}

function toLoginPage() {
  removeToken();

  // const oauth2Host = `${location.protocol}//${location.hostname}:${__LOGIN_APP_PORT__}`;

  // https://localhost:8301/oauth2/authorize?response_type=code&client_id=your-client-id&redirect_uri=localhost:8301/api/callback

  if (__ENV_DEV__) {
    window.location.href = `${location.protocol}//${location.hostname}:${__LOGIN_APP_PORT__}`;
  } else {
    window.location.href = 'redirectPath'; // TODO
  }
}

/**
 * 服务器原始状态处理
 */
function resolveHttpStatus(status: number, url = '') {
  switch (status.toString() as EAxiosResponseCode) {
    case EAxiosResponseCode.Succeed:
      break;
    case EAxiosResponseCode.OriginalSucceed:
      break;

    case EAxiosResponseCode.Unauthorized:
      toLoginPage();
      printErrorMsg('身份验证过期，需要重新登录');
      break;

    case EAxiosResponseCode.Rejected:
      toLoginPage();
      printErrorMsg('登录过期，需要重新登录');
      break;

    case EAxiosResponseCode.NotFound:
      printErrorMsg(`请求地址不存在：${url}`);
      break;

    case EAxiosResponseCode.TimeOut:
      printErrorMsg(`请求超时：${url}`);
      break;

    default:
      logError(`code: ${status} -> ${url}`);
  }
}

function printErrorMsg(message = '') {
  logError(message);
  if (AxiosRequest.toastOriginAxiosError) {
    Message.error(message);
    console.error(message);
  }
}

function logError(errorMessage = '') {
  console.error('服务异常：', errorMessage);
}
