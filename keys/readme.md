## 证书生成与安装请参考：


- npm i mkcert@1.5.1 -g
- cd keys
- mkcert create-ca
- mkcert create-cert --domains 127.0.0.1,localhost


- 接着安装证书
参考：https://zhuanlan.zhihu.com/p/551720193


- 开启https


*** 证书可能会失效，请记得按照说明文档进行更新即可 ***


将.env中的`HTTPS=false`替换为`HTTPS=true`， 重新`npm run dev`即可


![](./https.png)


![](./https-2.png)


目前证书中的域名有：
localhost
127.0.0.1
dev.cnsuning.com
fedev.cnsuning.com
dev.suning.com
fedev.suning.com
