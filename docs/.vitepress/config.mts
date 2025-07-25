import { defineConfig } from 'vitepress';
import container from 'markdown-it-container';
import { renderSandbox } from 'vitepress-plugin-sandpack';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "灵工5.0",
  description: "灵工5.0 文档",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Pnpm',
        items: [
          { text: '项目组织架构', link: '/pnpm/guide' },
          { text: 'pnpm package的管理', link: '/pnpm/package' },
          { text: '文件命名规范', link: '/pnpm/rule' },
          { text: 'typescript注释规范', link: '/pnpm/ts' },
        ]
      },
      {
        text: '拓展阅读',
        items: [
          { text: 'vitest体验（兼容jest api）', link: '/rec/vitest' },
          { text: '一文彻底搞懂package.json中的exports, main, module, type', link: '/rec/module' },
          { text: '如何优雅的调试node环境的npm package源码', link: '/rec/npm' },
          { text: '是时候和npm-check-updates江湖再见了~', link: '/rec/taze' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  markdown: {
    config(md) {
      md
        .use(container, 'sandbox', {
          render (tokens, idx) {
            return renderSandbox(tokens, idx, 'sandbox');
          },
        });
    },
  },
})
