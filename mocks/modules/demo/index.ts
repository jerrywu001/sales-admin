import { HttpResponse, delay, http } from 'msw';
import records from './res.json';
import { getHostbaseUrl } from '@core/api';

const successCode = '0';

const baseUrl = getHostbaseUrl();

let allOrders = JSON.parse(JSON.stringify(records));

const handlers = [
  http.get<any, any>(`${baseUrl}/api/demo/page`, async ({ request }) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get('page')) || 1;
    const size = Number(url.searchParams.get('size')) || 10;
    const name = url.searchParams.get('name') || '';
    const payeeNo = url.searchParams.get('payeeNo') || '';
    const payeeType = url.searchParams.get('payeeType') || '';
    const status = url.searchParams.get('status') || '';

    await delay(190);

    let all = allOrders.filter((v) => v.name.includes(name));

    all = all.filter((v) => v.payeeNo.includes(payeeNo));

    if (payeeType) {
      all = all.filter((v) => v.payeeType === payeeType);
    }

    if (status) {
      all = all.filter((v) => v.status === status);
    }

    const data = all.slice((page - 1) * size, page * size);

    return HttpResponse.json({
      code: successCode,
      message: null,
      context: {
        data,
        total: all.length,
      },
    });
  }),
];

export default handlers;
