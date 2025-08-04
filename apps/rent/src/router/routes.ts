import { RouteRecordRaw } from 'vue-router';
import { Page404 } from '@vue3/components';
import { initialRoutes } from './modules';
import { indexPath, Redirect } from '@core/main';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: indexPath,
    component: () => import('../layout/default.vue'),
    children: [
      {
        path: indexPath.slice(1),
        name: indexPath.slice(1),
        meta: { title: '首页' },
        component: () => import('../views/home/index.vue'),
      },
      {
        path: '/user-center/info',
        name: 'UserInfo',
        meta: {
          title: '个人中心',
          cache: false,
        },
        component: () => import('@/views/user-center/info/index.vue'),
      },
      {
        path: '/redirect',
        name: 'redirect',
        component: Redirect,
      },
    ],
  },
  {
    path: '',
    redirect: indexPath,
    component: () => import('../layout/default.vue'),
    children: [...initialRoutes],
  },
  {
    path: '/:pathMatch(.*)*',
    component: Page404,
  },
];

export default routes;
