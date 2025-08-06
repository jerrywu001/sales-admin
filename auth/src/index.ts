import { H3, redirect, serve } from 'h3';

let callbackHost = '';

const app = new H3();

app.get('/oauth2/authorize', (event) => {
  const query = new URLSearchParams(event.req.url.split('?')[1]);

  console.log('auth query:', query);

  const client_id = query.get('client_id');

  callbackHost = query.get('redirect_uri') || '';

  if (!client_id) {
    event.res.status = 200;
    event.res.statusText = 'OK';
    event.res.headers.set('Content-Type', 'text/html');
    return '<h1>client_id 缺失</h1>';
  }

  if (!callbackHost) {
    event.res.status = 200;
    event.res.statusText = 'OK';
    event.res.headers.set('Content-Type', 'text/html');
    return '<h1>redirect_uri 缺失</h1>';
  }

  redirect(event, `https://localhost:8300/?client_id=${query.get('client_id')}`);
});

app.post('/iam/login', (event) => {
  event.res.headers.set('Access-Control-Allow-Origin', '*');
  event.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken');
  event.res.headers.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  console.log('do login: ', callbackHost);
  redirect(event, `https://${callbackHost.split('/api')[0]}/?access_token=12345678`);
});

serve(app, { port: 3009 });
