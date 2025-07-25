/// <reference types="vite/client" />

import path from 'node:path';
import fs from 'node:fs';
import shelljs from 'shelljs';
import checker from 'vite-plugin-checker';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { loadEnv, defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import vueDevTools from 'vite-plugin-vue-devtools';
import { version } from './package.json';
import dotenv from 'dotenv';
import AfterBuild from './after-vite-build';
import WatchMocks from './watch-mocks';

dotenv.config({ path: path.join(__dirname, '../../.env.development') });

const resolve = (pathName) => path.resolve(__dirname, pathName);

const buildPath = resolve('./dist');

shelljs.rm('-rf', buildPath);

// @ts-ignore
export default defineConfig(({ command, mode }) => {
  const isBuild = command !== 'serve';
  const env = loadEnv(mode, process.cwd(), '');
  const paths = env.PROXY_PATHS.split(',').map((p) => `/${p}`);

  const proxyHost = env.API_HOST;
  const proxyProtocol = env.HTTPS === 'true' ? 'https:' : 'http:';
  const proxyPath = `${proxyProtocol}//${proxyHost}`;

  const proxyMap = paths.reduce((acc, v) => ({
    ...acc,
    [v]: proxyPath,
  }), {});

  return {
    base: isBuild ? './' : '/',
    clearScreen: false,
    css: {
      preprocessorOptions: {
        scss: { api: 'modern-compiler' },
        less: {
          javascriptEnabled: true,
          modifyVars: {},
        },
      },
    },
    define: {
      // vue3内置变量
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      __VUE_OPTIONS_API__: true, // 禁用后，如果使用options api, 会产生运行时报错（此时只能使用composition api）
      __VUE_PROD_DEVTOOLS__: false,

      __LOGIN_APP_PORT__: JSON.stringify(env.LOGIN_APP_PORT),
      __MAIN_APP_PORT__: JSON.stringify(env.MAIN_APP_PORT),
      __ENV_DEV__: JSON.stringify(!isBuild),
      __PROD__HOST_API__: JSON.stringify(env.API_HOST),
      __ENABLE_DEV_MOCK__: JSON.stringify(env.ENABLE_MOCK === 'true'),
      __MOCK_PROD__: JSON.stringify(env.MOCK_PROD === 'true'),
      __VERSION__: JSON.stringify(version),
      __BUILDDATE__: JSON.stringify(new Date().toLocaleString()),
      __BUILD_BY_VITE__: JSON.stringify(true),
    },
    server: {
      open: true,
      port: Number(env.LOGIN_APP_PORT) || undefined,
      host: env.VITE_HOST,
      https: env.HTTPS === 'true'
        ? {
          key: fs.readFileSync(path.join(__dirname, '../../keys/cert.key')),
          cert: fs.readFileSync(path.join(__dirname, '../../keys/cert.crt')),
        }
        : false,
      hmr: { overlay: true },
      proxy: env.ENABLE_MOCK === 'true'
        ? undefined
        : proxyMap,
    },
    resolve: { alias: { '@': path.resolve('src') } },
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      createHtmlPlugin(),
      env.ENABLE_TS_CHECK === 'true'
        ? checker({
          vueTsc: true,
          typescript: true,
        })
        : null,
      AfterBuild(() => {
        const existDist = fs.existsSync(resolve('../../dist'));

        if (existDist) shelljs.rm('-rf', '../../dist/account');
        if (!existDist) shelljs.mkdir('-p', resolve('../../dist'));

        shelljs.mv('-f', buildPath, resolve('./account'));
        shelljs.mv('-f', resolve('./account'), resolve('../../dist'));
        shelljs.cp('-f', resolve('../../dist/account/mockServiceWorker.js'), resolve('../../dist'));
      }),
      WatchMocks(),
    ],
  };
});
