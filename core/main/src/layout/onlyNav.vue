<template>
  <div class="page-container h-screen w-screen overflow-hidden flex flex-col">
    <!-- header area -->
    <header>
      <Nav :no-top-menus="noTopMenus" />
    </header>

    <div class="flex h-[calc(100vh-60px)]">
      <main class="page-content flex flex-col flex-1 overflow-hidden">
        <!-- main content -->
        <section class="main-content flex-1" :class="{'!pb-0': isPb0Routes}">
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
  </div>
</template>

<script setup lang="ts">
import Nav from './nav.vue';
import { computed } from 'vue';
import { pb0routes, useTabsStore } from '../..';
import { useRoute } from 'vue-router';

defineOptions({ name: 'OnlyNavLayout' });

defineProps({
  noTopMenus: {
    type: Boolean,
    default: false,
  },
});

const currentRoute = useRoute();

const tabsStore = useTabsStore();

const cachedRouteNames = computed(() => tabsStore.cachedRoutes.map((r) => r.name));

const isPb0Routes = computed(() => pb0routes.includes(currentRoute.name as string));
</script>

<style lang="scss" scoped>
.sidebars {
  @apply relative box-border w-[200px] transition-all;

  background-color: var(--color-bg-base);
  border-right: 1px var(--sidebar-border-color) solid;

  :deep(.el-menu) {
    border-right: none;
  }

  &.collapsed {
    width: 58px;

    :deep(.svg-icon) {
      @apply m-0 flex-1;

      color: var(--color-text-primary);
    }

    :deep(.el-menu--collapse) {
      width: 58px !important;
    }

    :deep(.el-sub-menu.is-active) {
      & > .el-sub-menu__title {
        & > .svg-icon {
          color: var(--color-primary) !important;
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

.main-content {
  @apply text-[14px] overflow-y-auto overflow-x-hidden p-[20px] box-border relative;

  background-color: var(--color-fill-2);
}

.toggle-sidebar {
  @apply absolute top-[236px] right-[-17px] h-[40px] w-[16px] z-50 cursor-pointer;

  border-color: var(--color-border-base);
  background-color: var(--color-bg-base);
  box-shadow: 3px 0px 5px rgb(51, 51, 51, .18);

  .svg-icon {
    @apply m-0 absolute top-[12px] left-0;

    color: var(--color-text-white);
  }
}
</style>
