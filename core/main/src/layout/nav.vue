<template>
  <nav class="header-nav">
    <!-- logo & title -->
    <div
      class="flex justify-center items-center cursor-pointer"
      @click="router.push('/')"
    >
      <img
        class="w-[117px] h-[34px] ml-[9px] mr-[49px]"
        :src="defaultNavLogo"
        alt="menu-log"
      >
    </div>

    <div v-if="showTopMenus && !noTopMenus" class="flex h-full">
      <div
        v-for="(v, idx) in menusStore.topMenus"
        :key="idx"
        class="top-menu"
        :class="{ active: v.name === activeMenu.name || !activeMenu.name && v.name === indexPath.slice(1) }"
        @click="changeSubMenus(v.routeName)"
      >
        <!-- <svg-icon :icon="v.icon" /> -->
        <span>{{ v.label }}</span>
      </div>
    </div>

    <div class="nav-right absolute right-2 flex items-center">
      <a-tooltip :content="themeTitle">
        <div class="nav-menu-icon small" @click="() => toggleDark()">
          <svg-icon :icon="!isDark ? 'tabler:sun-filled' : 'tabler:moon-filled'" />
        </div>
      </a-tooltip>

      <a-tooltip content="点击切换全屏模式">
        <div class="nav-menu-icon" @click="toggleFullScreen">
          <svg-icon :icon="!isFullscreen ? 'material-symbols-light:fullscreen' : 'material-symbols-light:fullscreen-exit'" />
        </div>
      </a-tooltip>

      <a-dropdown class="user-nickname-box" trigger="click">
        <a-avatar
          :size="32"
          :title="username"
          :style="{ marginRight: '8px', cursor: 'pointer' }"
        >
          <img alt="avatar" :src="DefaultHead">
        </a-avatar>
        <template #content>
          <a-doption>
            <a-space @click="router.push('/user-center/info')">
              <svg-icon icon="ri:user-line" class="dorp-icon" />
              <span>
                用户中心
              </span>
            </a-space>
          </a-doption>
          <a-doption>
            <a-space @click="doLogout">
              <svg-icon icon="ri:shut-down-line" class="dorp-icon" />
              <span>
                退出登录
              </span>
            </a-space>
          </a-doption>
        </template>
      </a-dropdown>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { getWithTopMenus, indexPath, useMenusStore, useUserStore } from '../..';
import { onConfirm, SvgIcon } from '@vue3/components';
import { computed, onBeforeMount, toRaw, watch } from 'vue';
import DefaultHead from '@app/assets/images/default-user.png';
import { useRoute, useRouter } from 'vue-router';
import defaultNavLogo from '@core/main/assets/images/default-nav-logo.png';
import { useFullscreen, useDark, useToggle } from '@vueuse/core';

defineEmits(['toggle-sidebar']);

defineProps({
  noTopMenus: {
    type: Boolean,
    default: false,
  },
});

const BroadcastChannelName = 'BroadcastChannelName';
const LogoutEventName = 'logout';

const router = useRouter();
const route = useRoute();

const isDark = useDark();
const toggleDark = useToggle(isDark);
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();

const { logout, state: userState } = useUserStore();
const { state: menusStore, currRoute, setSideMenus, getActiveTopMenu } = useMenusStore();

const routes = computed(() => router.getRoutes());
const username = computed(() => userState.name || '-');
const showTopMenus = computed(() => getWithTopMenus());
const activeMenu = computed(() => getActiveTopMenu());
const themeTitle = computed(() => !isDark.value ? '切换为暗黑模式' : '切换为浅色模式');

const changeSubMenus = (name: string) => {
  setSideMenus(name);

  router.push({ name });
};

const doLogout = () => {
  onConfirm({
    message: '确定要退出登录吗？',
    type: 'warning',
    onOk: async () => {
      await logout();

      const bc = new BroadcastChannel(BroadcastChannelName);

      bc.postMessage(LogoutEventName);
    },
  });
};

onBeforeMount(() => {
  menusStore.registedRoutes = routes.value;
  window.Navgation = router;
  window.CurrentRoute = route;
});

watch(
  () => route.name,
  () => {
    currRoute.value = {
      ...toRaw(route),
      matched: [],
    };
  },
  { immediate: true },
);

watch(
  () => isDark.value,
  (val) => {
    if (val) {
      document.body.setAttribute('arco-theme', 'dark');
    } else {
      document.body.removeAttribute('arco-theme');
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.header-nav {
  @apply box-border h-[60px] pl-[24px] pr-[32px] flex items-center bg-[var(--color-bg-2)] border-b;

  border-bottom-color: var(--color-border);
}

.top-menu {
  @apply flex items-center h-full px-[16px] text-[16px] cursor-pointer;

  span {
    @apply pl-1
  }
}

.nav-right {
  .svg-icon {
    @apply cursor-pointer hover:opacity-70;
  }
}

.user-nickname-box {
  &:hover {
    @apply opacity-75;
  }

  img {
    @apply w-[38px] h-[38px];
  }

  .svg-icon.dorp-icon {
    @apply w-[16px] h-[16px];
  }
}

.arco-avatar {
  background-color: transparent !important;
}

.arco-avatar-image img {
  object-fit: cover;
}

.nav-menu-icon {
  @apply border rounded-full w-7 h-7 flex items-center justify-center cursor-pointer mx-3;

  border-color: rgb(var(--gray-2));

  .svg-icon {
    @apply w-5 h-5 !text-[rgb(var(--gray-8))];
  }

  &.small {
    .svg-icon {
      @apply w-4 h-4;
    }
  }
}
</style>
