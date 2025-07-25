
import { App } from 'vue';
import { Router, RouteRecordRaw } from 'vue-router';
import { ISidebarMenu } from '@core/api';
import { setupRouter, useMenusStore, useUserStore } from '.';

// userPlugin.js
export const userAndMenusPlugin = async (
  app: App<Element>,
  {
    router,
    createRoutesFromMenu,
    after,
  }: {
    router: Router;
    createRoutesFromMenu: (menu: ISidebarMenu[]) => RouteRecordRaw[];
    after: (app: App<Element>) => void | Promise<void>;
  },
) => {
  const { state: menusStore } = useMenusStore();
  const { state: userState } = useUserStore();

  const {
    name,
    phone,
    enabled,
    menuData,
    topMenus,
    sideMenus,
    permissions,
  } = await setupRouter(router, createRoutesFromMenu);

  menusStore.menus = menuData;
  menusStore.topMenus = topMenus;
  menusStore.sideMenus = sideMenus;

  userState.permissions = permissions?.filter(Boolean) || [];
  userState.name = name;
  userState.phone = phone;
  userState.enabled = enabled;

  after(app);
};
