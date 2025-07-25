# 项目结构

- `pnpm-workspace.yaml`

```yaml
# monorepos
packages:
- 'assets'
- 'docs'
- 'mocks'
- 'tailwindconfig'
- 'components/**'
- 'core/**'
- 'apps/*'
```

- 目录结构

> `tree -L 2 | grep -v 'node_modules'`

```js
lg5-sass-web
├─.husky                              // git commit hooks
├─.vscode                            // vscode配置
├─apps                               // 业务应用
│  ├─agent                           // 代理商端
│  ├─company                        // 企业端
│  ├─login                          // 登录
│  └─main                          // saas端
├─assets                           // 公共资源
│  ├─images                       // 图片
│  └─styles                       // 样式 (包含全局主题色配置)
├─components
│  └─vue3                         // 和业务无关的全局vue3组件（UI相关交互组件）
├─core
│  ├─api                          // 全局公共接口
│  │  ├─axios-request
│  │  └─src
│  ├─main                        // 业务相关的公共逻辑和组件（apps各端共享）
│  │  ├─api
│  │  ├─assets
│  │  │  ├─images
│  │  │  └─styles
│  │  ├─src
│  │  │  ├─components
│  │  │  ├─composables
│  │  │  ├─directive
│  │  │  ├─jest-test-demo
│  │  │  ├─layout
│  │  │  ├─router
│  │  │  └─stores
│  │  └─types                       // 业务相关的公共类型定义
│  └─tools                         // 共享工具类
├─docs                            // 技术文档
├─.env.development                // 开发环境变量
├─mocks                           // 本地mock服务逻辑
└─tailwindconfig                 // tailwind配置
```
