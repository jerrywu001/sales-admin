import { reactive } from 'vue';
import { getPathByRouteName } from '@core/tools';
import { LocationQuery, RouteRecordRaw } from 'vue-router';

export const indexPath = '/dashboard';

export * from './userAndMenusPlugin';

export * from './api';

export { default as CommonApp } from './src/CommonApp.vue';

export * from './src/components';

export * from './src/composables';

export * from './src/directive';

export * from './src/router';

export * from './src/layout';

export * from './src/stores/user';
export * from './src/stores/menus';
export * from './src/stores/tabs';

export interface ITab {
  /** tab对应的路由名称 */
  name: string;
  query: LocationQuery;
  state?: Record<string, any>;
  /** tab对应的document.title */
  title: string;
  /**
   * tab是否缓存
   * @default false
  */
  cache: boolean;
}

export const defaultTab: ITab = {
  query: {},
  name: indexPath.slice(1),
  title: '首页',
  cache: false,
};

export interface RouteConfig {
  name: string;
  parentName: string;
  title: string;
  cache?: boolean;
  component: any;
}

export const getVueRoutes = (items: RouteConfig[]) => {
  return items.map((v) => ({
    component: v.component,
    path: getPathByRouteName(v.name),
    name: v.name,
    meta: {
      title: v.title,
      cache: v.cache || false,
      parentName: v.parentName || undefined,
    },
  } as RouteRecordRaw));
};

export function previewOfficeFile(url: string) { // TODO
  if (__ENV_DEV__) {
    window.open(`${location.protocol}//${location.hostname}:${__LOGIN_APP_PORT__}/office-previewer?url=${url}`);
  } else {
    window.open(`/office-previewer?url=${url}`);
  }
}

export const GlobalTitle = '平台';

/** 全局站点配置 */
export const GlobalSiteConfig = reactive({
  /**
   * @description 是否显示侧边栏
   * @default true
   */
  showSidebar: true,
  /**
   * @description 是否显示导航栏
   * @default true
   */
  showNavBar: true,
  /**
   * @description 是否显示 tabs
   * @default true
   */
  showTopTabs: true,
  /**
   * @description 是否显示面包屑
   * @default true
   */
  showBreadcrumb: true,

  /**
   * @description 表格配置
   */
  table: {
    /**
     * @description 是否显示表格索引列
     * @default true
     */
    showIndexColumn: true,
    /**
     * @description 表格索引列宽度
     * @default 60
     */
    columnWidth: 60,
    /**
     * @description 是否显示表格边框
     * @default true
     */
    bordered: false,
    /**
     * @description 是否显示表格行分页
     * @default false
     */
    pagination: false,
    /**
     * @description 是否显示表格行hover
     * @default true
     */
    hoverable: true,
    /**
     * @description 是否显示表格斑马线
     * @default false
     */
    stripe: false,
    /**
     * @description 是否显示表格列可调整宽度
     * @default true
     */
    columnResizable: true,
  },
});
