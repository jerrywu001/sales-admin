import { ITopMenu, type ISidebarMenu } from '@core/api';
import { defineStore } from 'pinia';
import { computed, reactive, toRaw, watch, watchEffect } from 'vue';
import { RouteLocationNormalizedLoadedGeneric, RouteRecordRaw } from 'vue-router';
import { getCustomState, useTabsStore } from './tabs';
import { findNodeByName, getParentMenus, getWithTopMenus, indexPath } from '../..';

interface State {
  topMenuName: string;
  /**
   * 当前注册路由
   * @description {@link RouteRecordRaw}
   */
  registedRouter: RouteRecordRaw;
  /**
   * 已注册的路由
   * @description {@link RouteRecordRaw}
   */
  registedRoutes: RouteRecordRaw[];
  /**
   * 面包屑导航节点
   * @description {@link ISidebarMenu}
   */
  breadcrumbs: ISidebarMenu[];
  /**
   * 后端返回的分类
   * @description {@link ISidebarMenu}
   */
  menus: ISidebarMenu[];
  /**
   * 顶部分类
   * @description {@link ITopMenu}
   */
  topMenus: ITopMenu[];
  /**
   * 侧边栏分类
   * @description {@link ISidebarMenu}
   */
  sideMenus: ISidebarMenu[];
}

export const useMenusStore = defineStore('menus-store', () => {
  const tabsStore = useTabsStore();
  const currRoute = reactive({ value: {} as RouteLocationNormalizedLoadedGeneric });

  const state = reactive({
    topMenuName: '',
    registedRouter: {} as RouteRecordRaw,
    registedRoutes: [] as RouteRecordRaw[],
    breadcrumbs: [] as ISidebarMenu[],
    menus: [] as ISidebarMenu[],
    topMenus: [] as ITopMenu[],
    sideMenus: [] as ISidebarMenu[],
  } as State);

  const routeName = computed(() => currRoute.value?.name as string || '');
  const routeQuery = computed(() => currRoute.value?.query || {});

  function addTabByPath() {
    let { name, query } = currRoute.value || {} as RouteLocationNormalizedLoadedGeneric;

    if (name === 'redirect') return;

    const currentRouteName = routeName.value;

    const existedIdx = tabsStore.tabList.findIndex((item) => item.name === currentRouteName);

    if (existedIdx > -1 || name === indexPath) {
      if (tabsStore.tabList[existedIdx]) { // router.replace 替换query/state
        tabsStore.tabList[existedIdx].query = query || {};
        tabsStore.tabList[existedIdx].state = getCustomState();
      }
      return;
    }

    tabsStore.addTab(currRoute.value as RouteLocationNormalizedLoadedGeneric);
  }

  function getActiveTopMenu(name = routeName.value) {
    let parentName = '';
    let topMenu = {} as ITopMenu;
    let parent = {} as ISidebarMenu;
    let parents = getParentMenus(name, state.menus);

    if (!parents.length) {
      parentName = state.registedRoutes.find((item) => item.name === name)?.meta.parentName as string;

      parents = getParentMenus(parentName, state.menus);
    }

    parent = parents?.[0] ? parents[0] : findNodeByName(state.menus, parentName);

    topMenu = parent
      ? {
        name: parent.name,
        routeName: parent.name,
        label: parent.meta?.title as string,
        icon: parent.meta?.icon as string,
      }
      : {} as ITopMenu;

    return topMenu;
  }

  function setSideMenus(name = routeName.value) {
    if (!state.registedRoutes.length) return;

    const withTopMenus = getWithTopMenus();

    if (!withTopMenus) {
      state.sideMenus = toRaw(state.menus);
      return;
    }

    const topMenu = getActiveTopMenu(name);

    if (topMenu.routeName) {
      const items = toRaw(state.menus).find((item) => item.name === topMenu.routeName)?.children || [];

      state.sideMenus = items;
      state.topMenuName = topMenu.routeName;
    }
  }

  watchEffect(() => {
    setSideMenus();
  });

  watch(
    () => state.registedRoutes,
    () => {
      const { pathname } = location;
      const routePath = pathname.replace(/^\/identity-[^/]+/, '');

      state.registedRouter = state.registedRoutes.find((route) => routePath === route.path);
    },
  );

  watch(
    [
      routeName,
      routeQuery,
    ],
    ([name]) => {
      // 根据当前route更新tab
      addTabByPath();

      let breads = getParentMenus(name as string, state.menus);

      if (!breads.length) {
        const parentName = state.registedRoutes.find((item) => item.name === name)?.meta.parentName as string;
        const theParent = findNodeByName(state.menus, parentName);

        breads = getParentMenus(parentName, state.menus);

        if (!breads.length) {
          breads = [toRaw(theParent) as ISidebarMenu];
        }
      }

      window.breadcrumbs = [
        ...breads,
        {
          name,
          meta: { title: currRoute.value.meta?.title as string },
        } as ISidebarMenu,
      ].filter((v) => !!v && v.name !== indexPath.slice(1));

      state.breadcrumbs = window.breadcrumbs;
    },
  );

  return {
    currRoute,
    state,
    setSideMenus,
    getActiveTopMenu,
  };
});
