import type { Config } from 'tailwindcss';
import path from 'node:path';

function resolve(dir) {
  return path.dirname(require.resolve(dir));
}

console.log('tailwindcss config: @app/tailwind/index.ts');

export default {
  content: [
    './src/**/*.{vue,tsx,css,scss,less,postcss}',
    path.join(resolve('@core/main'), './src/**/*.{vue,tsx,css,scss,less}'),
    path.join(resolve('@vue3/components'), './src/**/*.{vue,tsx,css,scss,less}'),
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1350px',
      '3xl': '1600px',
      xxl: '1780px',
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;

