import { ESystemType, updateMockEnvSysType } from '@core/api';
import { getHostbaseUrl } from '@core/tools';
import { HttpResponse, delay, http } from 'msw';
import loginInfo from './loginInfo.json';

const successCode = '0';

const baseUrl = getHostbaseUrl();

const getTokenStr = () => {
  return URL && URL.createObjectURL ? URL.createObjectURL(new Blob()).substr(-36) : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx';
};

const handlers = [
  http.get(`${baseUrl}/iam/user/info`, ({ request }) => {
    const authed = request.headers.get('Authorization');

    return HttpResponse.json({
      code: authed ? successCode : '401',
      message: null,
      context: loginInfo,
    });
  }),
  http.post<any, { password: string }>(`${baseUrl}/iam/login`, async () => {
    await delay(500);

    updateMockEnvSysType(ESystemType.SAAS);

    return HttpResponse.json({
      code: successCode,
      message: null,
      context: {
        token: getTokenStr(),
        systemType: ESystemType.SAAS,
      },
    });
  }),
  http.post<any, any>(`${baseUrl}/iam/sms/send/not-login`, async () => {
    await delay(500);

    return HttpResponse.json({
      code: successCode,
      message: null,
    });
  }),
];

export default handlers;
