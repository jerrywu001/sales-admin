import type { StorybookConfig } from '@storybook/vue3-vite';

// https://storybook.js.org/docs/writing-stories
const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  viteFinal: async (config, options) => {
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {});
  },
};

export default config;
