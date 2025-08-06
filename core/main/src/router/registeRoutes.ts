import { ISidebarMenu, ITopMenu, IUserInfo, queryLoginInfo, querySidebarMenus } from '@core/api';
import { Router, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import { Message } from '@arco-design/web-vue';
import { addIsThirdProperty, defaultTab, indexPath, updateNullLayoutToDefault } from '../..';

export const setupRouter = async (router: Router, createRoutesFromMenu: (menu: ISidebarMenu[]) => RouteRecordRaw[]): Promise<IRouteMenuData> => {
  NProgress.start();

  let name = '';
  let phone = '';
  let enabled = 0 as 0 | 1;
  let info = {} as IUserInfo;
  let menuData: ISidebarMenu[] = [];
  let topMenus: ITopMenu[] = [];
  let sideMenus: ISidebarMenu[] = [];
  let permissions: string[] = [];

  try {
    info = await queryLoginInfo();
    name = info.name;
    phone = info.phone;
    enabled = info.enabled;
  } catch (error) {
    Message.error((error as Error).message);
  }

  try {
    const withTopMenus = getWithTopMenus();
    const rs = await querySidebarMenus();

    menuData = rs.menus;
    permissions = rs.permissions;

    addIsThirdProperty(menuData);
    menuData.forEach((v) => updateNullLayoutToDefault(v));

    if (withTopMenus) {
      topMenus = [
        {
          name: indexPath.slice(1),
          routeName: indexPath.slice(1),
          label: defaultTab.title,
          icon: 'mingcute:home-4-line',
        },
        ...getTopMenus(menuData),
      ];
    } else {
      sideMenus = menuData;
    }
  } catch (error) {
    // 切换失败，取回默认身份
    Message.error((error as Error).message);
  }
  const routes = createRoutesFromMenu(menuData);

  NProgress.done();
  routes.forEach((route) => router.addRoute(route));

  return {
    name,
    phone,
    enabled,
    permissions,
    menuData,
    sideMenus,
    topMenus,
  };
};

function getTopMenus(all: ISidebarMenu[]) {
  return all.map((v) => {
    const childs = v.children || [];
    let firstChild = childs[0];

    if (firstChild?.children?.length > 0) {
      firstChild = firstChild.children[0];

      if (firstChild?.children?.length > 0) {
        firstChild = firstChild.children[0];
      }
    }

    const item = {
      name: v.name,
      routeName: firstChild?.name || undefined,
      label: v.meta?.title || '',
      icon: v.meta?.icon || '',
    } as ITopMenu;

    return item;
  });
}

export function getWithTopMenus() {
  return false; // TODO: 处理出top-menus
}

export interface IRouteMenuData {
  /** 用户名 */
  name: string;
  /** 手机号 */
  phone: string;
  /** 是否启用 1 启用，0 禁用 */
  enabled: 0 | 1;
  /** 权限列表 */
  permissions: string[];
  /** 菜单列表 */
  menuData: ISidebarMenu[];
  /** 顶部菜单列表 */
  topMenus: ITopMenu[];
  /** 侧边菜单列表 */
  sideMenus: ISidebarMenu[];
}
