<template>
  <div v-if="showTopMenus && !collapsed" class="py-[22px] px-[16px]">
    <div class="sidebar-banner w-[168px] h-[58px] flex items-center">
      {{ activeMenu.label }}功能
    </div>
  </div>

  <el-menu
    class="sider-menu"
    :unique-opened="true"
    :default-active="defaultActive"
    :collapse="isCollapsed"
  >
    <!-- 首页菜单 -->
    <el-menu-item
      v-if="!showTopMenus"
      :style="`margin-top: ${!showTopMenus ? 9 : 0}px`"
      :index="indexPath.slice(1)"
      @click="router.push(indexPath)"
    >
      <svg-icon
        icon="mingcute:home-4-line"
      />
      <span>首页</span>
    </el-menu-item>

    <!-- 其他动态菜单 -->
    <sidebar-items
      v-for="v in sideMenus"
      :key="v.name"
      :top-split="collapsed && showTopMenus"
      :item="v"
    />
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { StorageKeys } from '@core/api';
import { useStorage } from '@vueuse/core';
import { SvgIcon } from '@vue3/components';
import sidebarItems from './sidebarItems.vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMenu, ElMenuItem } from 'element-plus';
import { getWithTopMenus, indexPath, useMenusStore } from '../..';
import 'element-plus/dist/index.css';

defineOptions({ name: 'Sidebar' });

defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();
const route = useRoute();

const { state: menusStore, getActiveTopMenu } = useMenusStore();

const isCollapsed = useStorage(StorageKeys.sidebarCollapseKey, false);

const activeMenu = computed(() => getActiveTopMenu());
const showTopMenus = computed(() => getWithTopMenus());

const defaultActive = computed(() => route.name as string);
const sideMenus = computed(() => menusStore.sideMenus || []);
</script>

<style lang="scss">
.sidebar-banner {
  background-image: url('../../assets/images/sidebar-banner-bg.png');
  background-size: 100%;
  color: rgb(var(--primary-6));
  font-size: 14px;
  padding-left: 26px;
}

.sider-menu {
  @apply text-[14px] border-0 bg-transparent;

  color: var(--color-text-1);

  .svg-icon {
    @apply w-[18px] h-[18px] mr-[8px];

    color: var(--color-text-1);
  }
}

.el-menu-item:hover {
  background-color: var(--color-fill-2);
}

.el-sub-menu__title:hover {
  background-color: var(--color-fill-2);
}

.el-menu {
  background-color: transparent;
}

.el-sub-menu__title {
  user-select: none;
  color: var(--color-text-1);
  height: 40px !important;
  line-height: 40px !important;
}

.el-menu-item-group__title {
  color: var(--color-text-1);
}

.el-menu-item {
  user-select: none;
  color: var(--color-text-1);
  height: 40px !important;
  line-height: 40px !important;
  margin-top: 4px !important;
  border-radius: 2px !important;
}

.el-sub-menu.is-active {
  &>div {
    color: rgb(var(--primary-6));

    * {
      color: rgb(var(--primary-6));
    }
  }
}

.el-sub-menu.is-active .el-sub-menu.is-active {
  .el-sub-menu__title {
    color: rgb(var(--primary-6));

    * {
      color: rgb(var(--primary-6));
    }
  }
}

.el-menu-item.is-active,
.el-menu--collapse .el-sub-menu.is-active .el-sub-menu__title {
  color: rgb(var(--primary-6));
  background: var(--color-fill-2);

  &::after {
    content: '';
    display: block;
    position: absolute;
    right: 0;
    height: 100%;
    width: 2px;
    background-color: transparent;
  }
}
</style>
