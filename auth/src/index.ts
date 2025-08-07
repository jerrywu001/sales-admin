import { H3, redirect, serve } from 'h3';

let secureState = '';
let callbackHost = '';

const app = new H3();

app.get('/oauth2/authorize', (event) => {
  const query = new URLSearchParams(event.req.url.split('?')[1]);

  console.log('auth query:', event.req.url, query);

  const client_id = query.get('client_id');

  secureState = query.get('state');
  callbackHost = query.get('redirect_uri') || '';

  if (!secureState) {
    event.res.status = 200;
    event.res.statusText = 'OK';
    event.res.headers.set('Content-Type', 'text/html');
    return '<h1>state 缺失</h1>';
  }

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

  console.log('redirect to: ', callbackHost, secureState);

  redirect(event, `https://localhost:8300/?client_id=${query.get('client_id')}&state=${secureState}&redirect_uri=${callbackHost}`);
});

serve(app, { port: 3009 });
