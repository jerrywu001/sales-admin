import { ISidebarMenu } from 'core/api';
import { RouteLocationNormalizedLoadedGeneric, Router } from 'vue-router';

/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}

declare global {
  interface Window {
    breadcrumbs?: ISidebarMenu[];
    Navgation?: Router;
    CurrentRoute?: RouteLocationNormalizedLoadedGeneric;
    $: any;
  }

  declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;

    export default component;
  }

  /**
   * API环境
   */
  declare const __API_ENV__: 'small' | 'test' | 'uat' | 'prod';

  /**
   * package.json -> builddate
   */
  declare const __BUILDDATE__: string;

  /**
   * package.json -> version
   */
  declare const __VERSION__: string;

  /**
   * process.env是否是development
   */
  declare const __ENV_DEV__: boolean;

  /**
   * dev环境开启mock服务?
   */
  declare const __ENABLE_DEV_MOCK__: boolean;

  declare const __BUILD_BY_VITE__: boolean;

  /**
   * 是在生产环境启用mock
   */
  declare const __MOCK_PROD__: boolean;

  declare const __LOGIN_APP_PORT__: boolean;

  /** app port */
  declare const __MAIN_APP_PORT__: boolean;

  /** 租赁端口 */
  declare const __RENT_APP_PORT__: boolean;

  declare const $: any;

  // CSS modules
  type CSSModuleClasses = { readonly [key: string]: string };

  declare module '*.module.css' {
    const classes: CSSModuleClasses;

    export default classes;
  }
  declare module '*.module.scss' {
    const classes: CSSModuleClasses;

    export default classes;
  }
  declare module '*.module.sass' {
    const classes: CSSModuleClasses;

    export default classes;
  }
  declare module '*.module.less' {
    const classes: CSSModuleClasses;

    export default classes;
  }
  declare module '*.module.styl' {
    const classes: CSSModuleClasses;

    export default classes;
  }
  declare module '*.module.stylus' {
    const classes: CSSModuleClasses;

    export default classes;
  }
  declare module '*.module.pcss' {
    const classes: CSSModuleClasses;

    export default classes;
  }

  // CSS
  declare module '*.css' {
    const css: string;

    export default css;
  }
  declare module '*.scss' {
    const css: string;

    export default css;
  }
  declare module '*.sass' {
    const css: string;

    export default css;
  }
  declare module '*.less' {
    const css: string;

    export default css;
  }
  declare module '*.styl' {
    const css: string;

    export default css;
  }
  declare module '*.stylus' {
    const css: string;

    export default css;
  }
  declare module '*.pcss' {
    const css: string;

    export default css;
  }

  // Built-in asset types
  // see `src/constants.ts`

  // images
  declare module '*.jpg' {
    const src: string;

    export default src;
  }
  declare module '*.jpeg' {
    const src: string;

    export default src;
  }
  declare module '*.png' {
    const src: string;

    export default src;
  }
  declare module '*.gif' {
    const src: string;

    export default src;
  }
  declare module '*.svg' {
    const src: string;

    export default src;
  }
  declare module '*.ico' {
    const src: string;

    export default src;
  }
  declare module '*.webp' {
    const src: string;

    export default src;
  }
  declare module '*.avif' {
    const src: string;

    export default src;
  }

  // media
  declare module '*.mp4' {
    const src: string;

    export default src;
  }
  declare module '*.webm' {
    const src: string;

    export default src;
  }
  declare module '*.ogg' {
    const src: string;

    export default src;
  }
  declare module '*.mp3' {
    const src: string;

    export default src;
  }
  declare module '*.wav' {
    const src: string;

    export default src;
  }
  declare module '*.flac' {
    const src: string;

    export default src;
  }
  declare module '*.aac' {
    const src: string;

    export default src;
  }

  // fonts
  declare module '*.woff' {
    const src: string;

    export default src;
  }
  declare module '*.woff2' {
    const src: string;

    export default src;
  }
  declare module '*.eot' {
    const src: string;

    export default src;
  }
  declare module '*.ttf' {
    const src: string;

    export default src;
  }
  declare module '*.otf' {
    const src: string;

    export default src;
  }

  // other
  declare module '*.wasm' {
    const initWasm: (options: WebAssembly.Imports) => Promise<WebAssembly.Exports>;

    export default initWasm;
  }
  declare module '*.webmanifest' {
    const src: string;

    export default src;
  }
  declare module '*.pdf' {
    const src: string;

    export default src;
  }

  // web worker
  declare module '*?worker' {
    const workerConstructor: { new (): Worker };

    export default workerConstructor;
  }

  declare module '*?worker&inline' {
    const workerConstructor: { new (): Worker };

    export default workerConstructor;
  }

  declare module '*?sharedworker' {
    const sharedWorkerConstructor: { new (): SharedWorker };

    export default sharedWorkerConstructor;
  }

  declare module '*?raw' {
    const src: string;

    export default src;
  }

  declare module '*?url' {
    const src: string;

    export default src;
  }

  declare module '*?inline' {
    const src: string;

    export default src;
  }

  declare module '*.md' {
    const Component: ComponentOptions;

    export default Component;
  }
}
