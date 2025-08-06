# production

```bash
 server {
  listen 80;
  server_name xxx.xxx.com;

  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl;
  server_name xxx.xxx.com;

  ssl_certificate /xxx/xxx/keys/cert.crt;
  ssl_certificate_key /xxx/xxx/keys/cert.key;

  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';
  ssl_prefer_server_ciphers on;

  root /xxx/xxx;
  # index index.html index.htm;

  location / {
    index  index.html;
    try_files  $uri $uri/ /account/index.html;
  }
}
```

# kill port

```bash
# windows
netstat -ano | findstr :9300

# linux
lsof -i :9300

taskkill /PID 20228 /F
```
