import type { Plugin, ResolvedConfig } from 'vite';

/**
 * vite build finished, and emited asstets
 * @param callback (config) => void
 */
export default function AfterBuild(callback: (config: ResolvedConfig) => void): Plugin {
  let config: ResolvedConfig = null;

  return {
    name: 'after-build',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    closeBundle() {
      if (config.command === 'build') {
        if (callback) {
          callback(config);
        }
      }
    },
  };
}
