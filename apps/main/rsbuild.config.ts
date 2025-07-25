import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginSass } from '@rsbuild/plugin-sass';
import shelljs from 'shelljs';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

const isProd = true;
const buildWithSourceMap = process.env.SOURCE_MAP && process.env.SOURCE_MAP.includes('true');

const resolve = (pathName) => path.resolve(__dirname, pathName);

dotenv.config({ path: path.join(__dirname, '../../.env.development') });

const buildPath = resolve('./dist');

shelljs.rm('-rf', buildPath);

const myPlugin: any = () => ({
  setup: (api) => {
    api.onAfterBuild(() => {
      const existDist = fs.existsSync(resolve('../../dist'));

      if (existDist) shelljs.rm('-rf', '../../dist/identity-saas');
      if (!existDist) shelljs.mkdir('-p', resolve('../../dist'));

      shelljs.mv('-f', buildPath, resolve('./identity-saas'));
      shelljs.mv('-f', resolve('./identity-saas'), resolve('../../dist'));
      shelljs.cp('-f', resolve('../../dist/identity-saas/mockServiceWorker.js'), resolve('../../dist'));
    });
  },
});

export default defineConfig({
  mode: 'production',
  output: {
    assetPrefix: 'auto',
    sourceMap: {
      css: buildWithSourceMap,
      js: buildWithSourceMap ? 'source-map' : false,
    },
  },
  resolve: { alias: { '@': resolve('../../src') } },
  source: {
    entry: { index: './src/main.ts' },
    define: {
      // vue3内置变量
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      __VUE_OPTIONS_API__: true, // 禁用后，如果使用options api, 会产生运行时报错（此时只能使用composition api）
      __VUE_PROD_DEVTOOLS__: false,
      // 自定义变量
      __LOGIN_APP_PORT__: JSON.stringify(process.env.LOGIN_APP_PORT),
      __MAIN_APP_PORT__: JSON.stringify(process.env.MAIN_APP_PORT),
      __VERSION__: JSON.stringify(require(resolve('./package.json')).version),
      __BUILDDATE__: JSON.stringify(new Date().toLocaleString()),
      __ENABLE_DEV_MOCK__: JSON.stringify(process.env.ENABLE_MOCK === 'true'),
      __MOCK_PROD__: JSON.stringify(process.env.MOCK_PROD === 'true'), // 是否生产环境启用mock
      __ENV_DEV__: JSON.stringify(!isProd),
      __PROD__HOST_API__: JSON.stringify(process.env.API_HOST),
      __BUILD_BY_VITE__: JSON.stringify(false),
    },
  },
  html: {
    inject: true,
    title: '',
    template: resolve('./public/index-w5.html'),
    meta: {
      description: 'template',
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0',
    },
  },
  plugins: [
    myPlugin(),
    pluginVue(),
    pluginSass({ sassLoaderOptions: { implementation: require.resolve('sass') } }),
  ],
});
