import { ESmsType, ESystemType } from '..';
import { Http } from '../axios-request/Axios';
import { EAxiosResponseCode, getHttpErrorMessage } from '../axios-request/IAxiosRequest';
import { getHostbaseUrl, isNull } from '@core/tools';

const hostUrl = getHostbaseUrl();

export async function loginToServer(param: IUserParam, agentId?: number) {
  let obj = {} as ILoginResult;

  param = JSON.parse(JSON.stringify(param)) as IUserParam;

  try {
    const { code, context, message } = await Http.post<ILoginResult>(`${hostUrl}/iam/login`, {
      ...param,
      loginMethod: undefined,
      agentId: __ENV_DEV__ ? undefined : agentId || undefined,
    });

    if (code === EAxiosResponseCode.Succeed) {
      obj = context || {} as ILoginResult;
      obj.systemType = isNull(obj.systemType) ? undefined : obj.systemType;
    } else {
      throw new Error(message || '服务器异常，请稍后再试~');
    }
  } catch (error) {
    throw new Error(getHttpErrorMessage(error));
  }

  return obj;
}

export async function doLogout() {
  let errMsg = '';

  try {
    const { code, message } = await Http.delete<void>(`${hostUrl}/iam/login/logout`, {});

    if (code !== EAxiosResponseCode.Succeed) {
      errMsg = message || '退出失败，请稍后再试~';
    }
  } catch (error) {
    errMsg = getHttpErrorMessage(error);
  }

  return errMsg;
}

/**
 * 获取登录信息
 * @returns result {@link IUserInfo}
 */
export async function queryLoginInfo() {
  let result = {} as IUserInfo;

  try {
    const { code, context, message } = await Http.get<IUserInfo>(
      `${hostUrl}/iam/user/info`, {},
    );

    if (code === EAxiosResponseCode.Succeed) {
      result = context || {} as IUserInfo;
    } else if (message) {
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(getHttpErrorMessage(error));
  }

  return result;
}

/**
 * * 未登录发送验证码
 * @param sendType
 * @param phone
 * @param isCheck 是否检查手机号存在
 */
export async function sendNotLoginSmscode(sendType: ESmsType, phone: string, isCheck = false) {
  try {
    const { code, message } = await Http.post<void>(`${hostUrl}/iam/sms/send/not-login`, {
      sendType,
      phone,
      isCheck,
    });

    if (code !== EAxiosResponseCode.Succeed) {
      throw new Error(message || '发送失败，请稍后再试~');
    }
  } catch (error) {
    throw new Error(getHttpErrorMessage(error));
  }
}

export interface IUserInfo {
  /** 用户id */
  userId: number;
  /** 用户名 */
  name: string;
  /** 手机号 */
  phone: string;
  /** 1 启用，0 禁用 */
  enabled: 0 | 1;
}

export interface IUserParam {
  /** 验证码 */
  code?: string;
  /** 手机号 */
  username: string;
  /** 密码（loginMethod===1） */
  password?: string;
  /** 登录方式：0 验证码，1 密码 */
  loginMethod: 0 | 1;
}

export interface IGetPassWordParam {
  /** 手机号 */
  username: string;
  /** 验证码 */
  code?: string;
  /** 密码*/
  password: string;
  /** 确认密码 */
  confirmPassword?: string;
}

export interface ILoginResult {
  /** 登录token */
  token: string;
  /** 系统类型 */
  systemType: ESystemType;
  /** 首次登录时需要修改默认密码，修改默认密码时需携带确认码 */
  code: string;
}

export interface ISetPasswordParam {
  /** 手机号 */
  username: string;
  /** 新密码 */
  newPassword: string;
  /** 确认码, */
  code: string;
}
