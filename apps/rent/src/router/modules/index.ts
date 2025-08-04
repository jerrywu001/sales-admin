import { RouteRecordRaw } from 'vue-router';
import { systemRoutes } from './system';

export const initialRoutes = [
  // 系统管理
  ...systemRoutes,
] as RouteRecordRaw[];
