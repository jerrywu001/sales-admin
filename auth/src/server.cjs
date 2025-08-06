const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

let callbackHost = '';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/oauth2/authorize', (req, res) => {
  const query = new URLSearchParams(req.url.split('?')[1]);

  console.log('auth query:', query);

  const client_id = query.get('client_id');

  callbackHost = query.get('redirect_uri') || '';

  if (!client_id) {
    res.send('<h1>client_id 缺失</h1>');
  }

  if (!callbackHost) {
    res.send('<h1>redirect_uri 缺失</h1>');
  }

  res.redirect(301, `https://localhost:8300/?client_id=${query.get('client_id')}`);
});

app.post('/iam/login', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  console.log('do login: ', callbackHost);
  res.redirect(301, `https://${callbackHost.split('/api')[0]}/?access_token=12345678`);
});

app.listen(3009);
