import { ITab, defaultTab, tabState, indexPath } from '../..';
import { RouteLocationNormalizedLoadedGeneric } from 'vue-router';
import { defineStore } from 'pinia';
import { computed, nextTick, ref } from 'vue';
import { getSuffixName } from '@core/api';

export const useTabsStore = defineStore('tabs-store', () => {
  const tabList = ref<Array<ITab>>([defaultTab]);

  const cachedRoutes = computed(() => {
    return tabList.value.filter((item) => item.cache);
  });

  function reload() {
    window.location.reload();
  }

  function editTabName(title: string, name = window.CurrentRoute?.name, skipBreadcrumbs = false) {
    const tab = tabList.value.find((item) => item.name === name);

    if (tab && window?.breadcrumbs) {
      const item = window.breadcrumbs.find((item) => item.name === tab.name);

      tab.title = title;

      if (!skipBreadcrumbs && item && item.meta) {
        item.meta.title = title;
      }

      document.title = title + getSuffixName();
    }
  }

  function updatetRouteQuery(query: Record<string, any>) {
    const tab = tabList.value.find((item) => item.name === window.CurrentRoute?.name);

    if (tab) {
      tab.query = {
        ...tab.query,
        ...query,
      };
    }
  }

  function addTab(menu: RouteLocationNormalizedLoadedGeneric) {
    const tab: ITab = {
      query: menu.query || {},
      name: menu.name as string,
      title: menu.meta?.title as string || '',
      cache: menu.meta?.cache === true,
    };

    if (hasCustomHistoryState()) {
      tab.state = getCustomState();
    }

    if (tabState.replaceIndex > -1) {
      tabList.value.splice(tabState.replaceIndex, 0, tab);
    } else {
      tabList.value.push(tab);
    }
  }

  function closeAndBack() {
    nextTick(() => {
      const index = tabList.value.findIndex((item) => item.name === window.CurrentRoute?.name);

      if (index > 0) {
        // removeTab(window.CurrentRoute?.name as string);
        tabList.value.splice(index, 1);
        window.Navgation.back();
      }
    });
  }

  function removeAll() {
    tabList.value = [defaultTab];
    window.Navgation.push(indexPath);
  }

  function removeOthers(name: string) {
    tabList.value = tabList.value.filter((item) => item.name === name || item.name === defaultTab.name);
    const lastTab = tabList.value[tabList.value.length - 1];

    window.Navgation.push({
      name: lastTab.name,
      query: lastTab.query,
      state: lastTab.state ? JSON.parse(JSON.stringify(lastTab.state)) : undefined,
    });
  }

  function removeTab(name: string, toLastTab = true) {
    const index = tabList.value.findIndex((item) => item.name === name);

    if (name === defaultTab.name) return;

    if (index > -1) {
      tabList.value.splice(index, 1);

      if (!toLastTab) return;

      const lastTab = tabList.value[tabList.value.length - 1];

      window.Navgation.push({
        name: lastTab.name,
        query: lastTab.query,
        state: lastTab.state ? JSON.parse(JSON.stringify(lastTab.state)) : undefined,
      });
    }
  }

  return {
    /** 需要缓存的tabs */
    cachedRoutes,
    /** 所有tabs */
    tabList,
    reload,
    addTab,
    removeTab,
    removeOthers,
    removeAll,
    closeAndBack,
    editTabName,
    updatetRouteQuery,
  };
});

const insetKeys = new Set(['back', 'current', 'forward', 'position', 'replaced', 'scroll']);

export function hasCustomHistoryState() {
  const { state } = history;

  const isObject = state && typeof state === 'object' && !Array.isArray(state);
  const hasCutomKeys = Object.keys(state).some((key) => !insetKeys.has(key));

  return isObject
    ? hasCutomKeys
    : false;
}

export function getCustomState<T extends any = any>() {
  const { state } = history;
  const customState = Object.keys(state).reduce((prev, key) => {
    if (!insetKeys.has(key)) {
      prev[key] = state[key];
    }

    return prev;
  }, {});

  return customState as T;
}
