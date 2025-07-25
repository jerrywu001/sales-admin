import type { Preview } from '@storybook/vue3-vite';
import { setup } from '@storybook/vue3';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

setup((app) => {
  app.use(ArcoVue);
});

export default preview;
