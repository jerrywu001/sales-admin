import { RouteRecordRaw } from 'vue-router';
import { Page404 } from '@vue3/components';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: () => import('../views/login/index.vue'),
  },
  {
    path: '/office-previewer',
    name: 'officePreviewer',
    meta: { title: '文件预览' },
    component: () => import('../views/office-previewer/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: Page404,
  },
];

export default routes;
