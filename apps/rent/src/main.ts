import App from './App.vue';
import ArcoVue from '@arco-design/web-vue';
import { AxiosRequest } from '@core/api';
import { logEnvInfo } from '@core/tools';
import { directive, userAndMenusPlugin } from '@core/main';
import router, { createRoutesFromMenu } from './router';
import { createPinia } from 'pinia';
import { computed, createApp, markRaw } from 'vue';

import 'dayjs/locale/zh-cn';

import 'normalize.css/normalize.css';
import '@arco-design/web-vue/dist/arco.css';
import '@core/main/assets/styles/main.scss';

AxiosRequest.init();

logEnvInfo();

const pinia = createPinia();

pinia.use(() => ({ route: computed(() => markRaw(router.currentRoute.value)) }));

async function renderApp() {
  const app = createApp(App).use(pinia);

  await app.use(
    userAndMenusPlugin,
    {
      router,
      createRoutesFromMenu,
      after: (instance) => {
        instance.use(ArcoVue)
          .use(router)
          .mount('#app');

        directive(instance);
      },
    },
  );
}

if (__ENABLE_DEV_MOCK__ || __MOCK_PROD__) {
  import('@app/mock').then(async ({ default: worker }) => {
    await worker.start({ onUnhandledRequest: 'bypass' });
    renderApp();
  });
} else {
  renderApp();
}
