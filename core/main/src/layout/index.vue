<template>
  <div class="page-container h-screen w-screen overflow-hidden flex flex-col">
    <!-- header area -->
    <header :style="{ display: GlobalSiteConfig.showNavBar ? 'block' : 'none' }">
      <Nav />
    </header>

    <div class="flex h-[calc(100vh-60px)]" :class="{ 'h-screen': !GlobalSiteConfig.showNavBar }">
      <div
        ref="sidebarRef"
        class="sidebars flex flex-col"
        :class="[
          { 'collapsed': sidebarCollapsed },
          { 'hidden': !GlobalSiteConfig.showSidebar }
        ]"
      >
        <!-- sidebar links -->
        <div class="sidebar-scroller w-full flex-1 overflow-y-auto box-border p-2" :style="`height: ${sidebarH}px`">
          <Sidebar :collapsed="sidebarCollapsed" />
        </div>

        <!-- toggle-icon -->
        <div
          class="toggle-sidebar"
          @click="toggleCollapseSidebars"
        >
          <svg-icon
            class="cursor-pointer hover:opacity-70 mr-3 !w-[14px] !h-[14px]"
            :icon="!sidebarCollapsed ? 'uiw:left' : 'uiw:right'"
          />
        </div>
      </div>

      <main class="page-content flex flex-col flex-1 overflow-hidden">
        <Tabs v-if="GlobalSiteConfig.showTopTabs" />

        <!-- main content -->
        <section class="main-content flex-1" :class="{'!pb-0': isPb0Routes}">
          <breadcrumb-items v-if="GlobalSiteConfig.showBreadcrumb && currentRoute.name !== indexPath.slice(1)" />

          <router-view v-slot="{ Component, route }">
            <transition
              name="fade-transform"
              mode="out-in"
            >
              <keep-alive :include="cachedRouteNames">
                <component
                  :is="Component"
                  v-if="!route.meta.link"
                  :key="route.path"
                />
                <div
                  v-else
                  class="h-full"
                >
                  <iframe
                    :src="route.meta.link as string"
                    frameborder="no"
                    style="width: 100%;height: 100%"
                    scrolling="auto"
                  />
                </div>
              </keep-alive>
            </transition>
          </router-view>
        </section>
      </main>
    </div>

    <message-box />
  </div>
</template>

<script setup lang="ts">
import Nav from './nav.vue';
import Tabs from './tabs.vue';
import Sidebar from './sidebar.vue';
import { StorageKeys } from '@core/api';
import { useRoute } from 'vue-router';
import BreadcrumbItems from './breadcrumbItems.vue';
import { SvgIcon, MessageBox } from '@vue3/components';
import { computed, onBeforeMount, nextTick, ref } from 'vue';
import { useStorage, useWindowSize } from '@vueuse/core';
import { GlobalSiteConfig, indexPath } from '../../index';
import { pb0routes, useTabsStore } from '../..';

defineOptions({ name: 'CommonLayout' });

const sidebarH = ref(0);
const sidebarRef = ref<HTMLDivElement>(null);
const currentRoute = useRoute();

const { width } = useWindowSize();

const tabsStore = useTabsStore();

const isCollapsed = useStorage(StorageKeys.sidebarCollapseKey, false);

const smallScreen = computed(() => width.value <= 1024);
const cachedRouteNames = computed(() => tabsStore.cachedRoutes.map((r) => r.name));
const sidebarCollapsed = computed(() => isCollapsed.value);
const isPb0Routes = computed(() => pb0routes.includes(currentRoute.name as string));

function toggleCollapseSidebars() {
  isCollapsed.value = !sidebarCollapsed.value;
}

onBeforeMount(() => {
  if (smallScreen.value) {
    isCollapsed.value = true;
  }

  nextTick(() => {
    sidebarH.value = sidebarRef.value?.clientHeight;
  });

  window.addEventListener('resize', () => {
    sidebarH.value = sidebarRef.value?.clientHeight;
  });
});
</script>

<style lang="scss" scoped>
:deep(.arco-breadcrumb-item) {
  user-select: none;
}

.sidebars {
  @apply relative box-border w-[220px] transition-all;

  background-color: var(--color-menu-light-bg);
  border-right: 1px var(--color-border) solid;

  :deep(.el-menu) {
    border-right: none;
  }

  h5 {
    color: var(--color-text-1);
    font-size: 14px;
  }

  &.collapsed {
    width: 58px;

    :deep(.svg-icon) {
      @apply m-0 flex-1;

      color: var(--color-text-1);
    }

    :deep(.el-menu--collapse) {
      width: 58px !important;
    }

    :deep(.el-sub-menu.is-active) {
      & > .el-sub-menu__title {
        & > .svg-icon {
          color: rgb(var(--primary-6)) !important;
        }
      }
    }

    :deep(.el-icon) {
      display: none;
    }

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      padding: 0 !important;

      span {
        display: none;
      }
    }
  }

  :deep(.v-leave-active) {
    .svg-icon {
      display: block !important;
    }

    :deep(.el-icon) {
      display: none;
    }

    .el-menu-item span,
    .el-sub-menu__title span {
      display: none;
    }
  }

  :deep(.el-menu--collapse.v-leave-active) {
    width: 100%;

    .svg-icon {
      display: none !important;
    }
  }

  &.sidebars-fiexd {
    @apply fixed left-0 h-screen z-20 top-0;

    &.collapsed {
      left: -57px;
    }
  }
}

.sidebar-scroller {
  &::-webkit-scrollbar {
    width: 12px;
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border: 4px solid transparent;
    background-clip: padding-box;
    border-radius: 7px;
    background-color: var(--color-text-4);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-text-3);
  }
}

.main-content {
  @apply text-[14px] overflow-y-auto overflow-x-hidden px-[20px] pt-[20px] pb-[32px] box-border relative;

  background-color: var(--color-fill-2);
}

.toggle-sidebar {
  @apply absolute top-[236px] right-[-16px] h-[40px] w-[16px] z-50 cursor-pointer;

  border-style: solid;
  border-width: 1px;
  border-left: 0;
  border-color: var(--color-border);
  background-color: var(--color-menu-light-bg);
  box-shadow: 3px 0px 5px rgb(51, 51, 51, .18);

  .svg-icon {
    @apply m-0 absolute top-[12px] left-0;

    color: var(--color-text-1);
  }
}
</style>
