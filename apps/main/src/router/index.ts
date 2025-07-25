import { createAppRouter } from '@core/main';
import { default as insetRoutes } from './routes';
import { ISidebarMenu } from '@core/api';
import { RouteRecordRaw } from 'vue-router';
import { getPathByRouteName } from '@core/tools';

const router = createAppRouter(insetRoutes);

const loadView = (compPath: string) => {
  if (__BUILD_BY_VITE__) {
    const modules = import.meta.glob('../views/**/*.vue');

    return modules[`../views/${compPath}/index.vue`];
  }

  const route = () => import(`@/views/${compPath}/index.vue`);

  return route;
};

const depthResolveRoutes = (menus: ISidebarMenu[], allFlat: RouteRecordRaw[]) => {
  for (const item of menus) {
    const children = item.children || [];

    if (children.length > 0) {
      depthResolveRoutes(children, allFlat);
      continue;
    }

    if (!item.component || !item.layout) continue;

    let route = {
      name: `${item.name}Parent`,
      meta: item.meta || {},
    } as RouteRecordRaw;

    if (item.layout === 'normal') {
      route.component = () => import('@/layout/normal.vue');
    }

    if (item.layout === 'default') {
      route.component = () => import('@/layout/default.vue');
    }

    route.children = [
      {
        path: getPathByRouteName(item.name),
        name: item.name,
        meta: item.meta || {},
        component: item.component ? loadView(item.component) : null,
      } as RouteRecordRaw,
    ];

    allFlat.push(route);
  }
};

export function createRoutesFromMenu(menu: ISidebarMenu[]) {
  const all: RouteRecordRaw[] = [];

  depthResolveRoutes(menu, all);

  return all.filter(Boolean);
}

export default router;
