import { getHostbaseUrl } from '@core/tools';
import { HttpResponse, delay, http } from 'msw';
import saasMenus from './saas-menus.json';

const successCode = '0';

const allSaasMenus = JSON.parse(JSON.stringify(saasMenus));

const baseUrl = getHostbaseUrl();

let menuList = JSON.parse(JSON.stringify(saasMenus));

const handlers = [
  http.get(`${baseUrl}/iam/menu/build`, async ({ request }) => {
    const authed = request.headers.get('Authorization');

    menuList = allSaasMenus;

    await delay(0);

    return HttpResponse.json({
      code: authed ? successCode : '401',
      message: null,
      context: {
        menuData: menuList,
        permissions: [
          'acc:business-scenarios:tab:staff',
          'acc:collect:tab:code',
          'acc:company:tab:child',
          'acc:company:tab:bind',
          'acc:company:tab:invite',
          'acc:company:group:record',
          'acc:company:tab:apply',
          'acc:company:tab:manage',
          'acc:company:platform:record',
          'air:product:channel:toggle',
          'air:product:channel:update',
          'air:product:agent:add',
          'air:product:agent:toggle',
          'air:product:agent:update',
          'air:product:agent:delete',
          'air:product:company:add',
          'air:product:company:delete',
          'air:product:company:toggle',
          'air:product:company:update',
          'air:product:account:add',
          'air:product:account:bill',
          'air:product:account:toggle',
          'air:product:account:withdraw',
          'air:product:account:no-pass-auth',
          'air:bill:in:detail',
          'air:bill:in:thaw',
          'air:bill:in:batch-thaw',
          'air:bill:order:pay',
          'air:bill:order:cancel',
          'air:bill:order:detail',
          'air:bill:order:detail',
          'air:split:payee:add',
          'air:split:payee:toggle',
          'agent:manage:basic:update-phone',
          'payer:manage:basic:update-phone',
          'payee:manage:basic:update-phone',
          'agent:manage:basic:update-pay-pass',
          'payer:manage:basic:update-pay-pass',
          'payee:manage:basic:update-pay-pass',
          'agent:manage:basic:find-pay-pass',
          'payer:manage:basic:find-pay-pass',
          'payee:manage:basic:find-pay-pass',
          'payee:manage:basic:cancel',
          'payer:manage:basic:cancel',
          'agent:manage:basic:cancel',
          'agent:manage:bank:change',
          'payee:manage:bank:change',
          'payer:manage:bank:change',
          'agent:manage:withdraw:export',
          'payee:manage:withdraw:export',
          'payer:manage:withdraw:export',
          'agent:manage:trans:export',
          'payee:manage:trans:export',
          'payer:manage:trans:export',
          'agent:manage:statement:export',
          'payee:manage:statement:export',
          'payer:manage:statement:export',
          'agent:manage:receipt:export',
          'payee:manage:receipt:export',
          'payer:manage:receipt:export',
          'yop:product:account:add',
        ],
      },
    });
  }),
  http.delete(`${baseUrl}/iam/login/logout`, async () => {
    await delay(900);

    return HttpResponse.json({
      code: successCode,
      message: null,
      context: {},
    });
  }),
];

export default handlers;
