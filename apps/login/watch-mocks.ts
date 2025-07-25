import type { Plugin } from 'vite';
import chokidar from 'chokidar';
import fs from 'node:fs';
import path from 'node:path';
/**
 * vite build finished, and emited asstets
 * @param callback (config) => void
 */
export default function WatchMocks(): Plugin {
  let isInitialLoad = true;

  return {
    name: 'watch-mocks',
    configureServer(server) {
      const mockIndex = path.resolve(__dirname, '../../mocks/index.ts');

      const watcher = chokidar.watch(path.resolve(__dirname, '../../mocks/modules'), {
        ignored: /(^|[/\\])\../, // ignore dotfiles
        persistent: true,
      });

      watcher.on('add', (path) => {
        if (!isInitialLoad) {
          fs.readFile(mockIndex, 'utf8', (err, data) => {
            if (err) return;

            fs.writeFile(mockIndex, data, 'utf8', (err) => {
              if (err) console.error('Error writing index.ts:', err);

              console.log(`Mock file: ${path} added`);
            });
          });
        }
      });

      watcher.on('error', (error) => {
        console.error('Watcher error:', error);
      });

      watcher.on('ready', () => {
        isInitialLoad = false;
      });

      // 确保在服务器关闭时关闭 watcher
      server.httpServer.on('close', () => {
        watcher.close();
        console.log('Watcher closed');
      });
    },
  };
}
