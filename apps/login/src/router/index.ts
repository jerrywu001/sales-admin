import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import routes from './routes';

import 'nprogress/nprogress.css';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

NProgress.configure({ showSpinner: false });

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);

  if (isChunkLoadFailed) {
    location.reload();
  }
});

export default router;
