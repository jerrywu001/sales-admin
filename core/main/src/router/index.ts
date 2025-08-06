import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { ISidebarMenu } from '@core/api';
import NProgress from 'nprogress';

import 'nprogress/nprogress.css';

export function createAppRouter(insetRoutes: RouteRecordRaw[]) {
  NProgress.configure({ showSpinner: false });

  const router = createRouter({
    history: createWebHistory(),
    routes: [...insetRoutes],
  });

  router.beforeEach((to, from, next) => {
    NProgress.start();

    if (to.meta.title) {
      document.title = to.meta.title as string;
    }

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

  return router;
}

/**
 * 从菜单中获取所有父级
*/
export const getParentMenus = (menuName: string, menus: ISidebarMenu[]) => {
  let result: ISidebarMenu[] = [];

  function search(nodes: ISidebarMenu[], name: string) {
    for (let node of nodes) {
      if (node.name === name) {
        return true;
      }

      if (node.children) {
        if (search(node.children, name)) {
          result.push(JSON.parse(JSON.stringify(node)));
          return true;
        }
      }
    }
    return false;
  }

  search(menus, menuName);

  return result.reverse();
};

export function findNodeByName(data: ISidebarMenu[], name: string) {
  for (let item of data) {
    if (item.name === name) {
      return item;
    }

    if (item.children) {
      const result = findNodeByName(item.children, name);

      if (result) {
        return result;
      }
    }
  }

  return null;
}

export function addIsThirdProperty(menu: ISidebarMenu[]) {
  menu.forEach((item) => {
    if (item.children && item.children.length > 0) {
      addIsThirdProperty(item.children);

      item.children.forEach((child) => {
        if (child.children && child.children.length > 0) {
          child.children.forEach((grandchild) => {
            grandchild.isThird = true;
          });
        }
      });
    }
  });
}

export function updateNullLayoutToDefault(node: ISidebarMenu) {
  if (!node.children || node.children.length === 0) {
    node.layout = node.layout || 'default';
  }

  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => updateNullLayoutToDefault(child));
  }
}

/** main-content dom --> padding-bottom: 0 */
export const pb0routes = [
  'SettlementDetail',
  'SettlementPayment',
  'BrokerSettlementPayment',
  'BrokerSettlementDetail',
  'InvoiceOpenInfo',
  'InvoiceOpenForm',
  'AppletSubmitInformation',
  'BrokerInvoiceOpenInfo',
  'BrokerInvoiceOpenForm',
];

export * from './registeRoutes';
