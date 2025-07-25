import App from './App.vue';
import ArcoVue from '@arco-design/web-vue';
import { AxiosRequest } from '@core/api';
import { logEnvInfo } from '@core/tools';
import router from './router';
import { createApp } from 'vue';

import '@arco-design/web-vue/dist/arco.css';
import 'normalize.css/normalize.css';
import './assets/styles/main.scss';

AxiosRequest.init();

logEnvInfo();

function renderApp() {
  const app = createApp(App);

  app.use(ArcoVue)
    .use(router)
    .mount('#app');
}

if (__ENABLE_DEV_MOCK__ || __MOCK_PROD__) {
  import('@app/mock').then(async ({ default: worker }) => {
    await worker.start({ onUnhandledRequest: 'bypass' });
    renderApp();
  });
} else {
  renderApp();
}
