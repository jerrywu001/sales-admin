import { AxiosRequest } from './AxiosRequest';
import qs from 'qs';
import { axiosPostContentType, EParamsSendType, RequestConfig } from './IAxiosRequest';
import { Method } from 'axios';

export class Http extends AxiosRequest {
  /**
   * get 方法
   * @param url 接口地址
   * @param query get 对应的query
   * @param opts request-config [{@link RequestConfig}]
   */
  static async get<T>(url: string, query: object = {}, opts = {} as RequestConfig) {
    delete opts.paramsSendType;
    const res = await Http.common<T>({
      method: 'get',
      url,
      params: query,
      ...opts,
    });

    return res;
  }

  /**
   * post 方法
   * @param url 接口地址
   * @param body post 对应的参数
   * @param opts request-config [{@link RequestConfig}]
   */
  static post<T>(
    url: string,
    body: object = {},
    opts = {} as RequestConfig,
  ) {
    opts.paramsSendType = opts.paramsSendType || EParamsSendType.RequestPayload;
    return Http.commonHandler<T>('post', url, body, opts);
  }

  /**
   * put 方法
   * @param url 接口地址
   * @param body put 对应的参数
   * @param opts request-config [{@link RequestConfig}]
   */
  static put<T>(
    url: string,
    body: object = {},
    opts = {} as RequestConfig,
  ) {
    return Http.commonHandler<T>('put', url, body, opts);
  }

  /**
   * delete 方法
   * @param url 接口地址
   * @param body delete 对应的参数
   * @param opts request-config [{@link RequestConfig}]
   */
  static delete<T>(
    url: string,
    body: object = {},
    opts = {} as RequestConfig,
  ) {
    return Http.commonHandler<T>('delete', url, body, opts);
  }

  /**
   * post/put/delete 方法
   * @param url 接口地址
   * @param body post/put/delete 对应的参数
   * @param opts request-config [{@link RequestConfig}]
   */
  static async commonHandler<T>(
    method: Method,
    url: string,
    body: object = {},
    opts = {} as RequestConfig,
  ) {
    const { paramsSendType } = opts;
    const isFormDatadMode = paramsSendType === EParamsSendType.FormData;
    const axiosContentType = opts.headers ? opts.headers['Content-Type'] : undefined;
    const contentType = axiosContentType || axiosPostContentType[paramsSendType];
    const params: RequestConfig = {
      method,
      url,
      data: isFormDatadMode ? qs.stringify(body) : body,
    };

    params.headers = {
      ...opts.headers,
      'Content-Type': contentType,
    };

    const res = await Http.common<T>(params);

    return res;
  }
}
