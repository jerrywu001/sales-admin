import { ITestTableParam, IPayeeItem } from '../types';
import { EAxiosResponseCode, getHostbaseUrl, getHttpErrorMessage, Http } from '@core/api';

const hostUrl = getHostbaseUrl();

/**
 * 空中分账 - 分账管理 - 收款方管理
 */
export async function queryPayees(param: ITestTableParam) {
  let data = [] as IPayeeItem[];
  let total = 0;

  param = JSON.parse(JSON.stringify(param)) as ITestTableParam;
  param.payeeType = param.payeeType || undefined;

  try {
    const { code, context, message } = await Http.get<{
      data: IPayeeItem[];
      total: number;
    }>(`${hostUrl}/api/demo/page`, param);

    if (code === EAxiosResponseCode.Succeed) {
      const { data: items, total: all } = context || {} as {
        data: IPayeeItem[];
        total: number;
      };

      data = items || [];
      total = all || 0;
    } else {
      throw new Error(message || '服务器异常，请稍后再试~');
    }
  } catch (error) {
    throw new Error(getHttpErrorMessage(error));
  }

  return {
    data,
    total,
  };
}
