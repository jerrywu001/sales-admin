<template>
  <div
    class="page-container h-screen w-screen overflow-hidden flex"
  >
    <main class="page-content flex flex-col flex-1 overflow-hidden">
      <!-- header area -->
      <header>
        <Nav :style="{ display: GlobalSiteConfig.showNavBar ? 'block' : 'none' }" />
        <Tabs v-if="GlobalSiteConfig.showTopTabs" />
      </header>

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

    <message-box />
  </div>
</template>

<script setup lang="ts">
import Nav from './nav.vue';
import Tabs from './tabs.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { MessageBox } from '@vue3/components';
import BreadcrumbItems from './breadcrumbItems.vue';
import { GlobalSiteConfig, indexPath } from '../../index';
import { pb0routes, useTabsStore } from '../..';

defineOptions({ name: 'NormalLayout' });

const tabsStore = useTabsStore();

const currentRoute = useRoute();

const cachedRouteNames = computed(() => tabsStore.cachedRoutes.map((r) => r.name));
const isPb0Routes = computed(() => pb0routes.includes(currentRoute.name as string));
</script>

<style lang="scss" scoped>
.main-content {
  @apply text-[14px] overflow-y-auto overflow-x-hidden p-[20px] box-border relative;

  background-color: var(--color-fill-2);
}

:deep(.arco-breadcrumb-item) {
  user-select: none;
}
</style>
