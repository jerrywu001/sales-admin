<template>
  <a-scrollbar outer-class="tabs" :style="`width: ${tabsW}px; overflow-x: auto; overflow-y: hidden;`">
    <div class="tabs-inner h-full flex">
      <div
        v-for="(v, idx) in tabList"
        :key="idx"
        class="tab-item"
        :data-name="v.name"
        :class="[
          { active: v.name === route.name },
          { 'no-close': v.name === indexPath.slice(1) },
        ]"
      >
        <a
          @click="toPage(v, idx)"
        >
          {{ v.title }}
        </a>

        <svg-icon
          v-if="v.name !== indexPath.slice(1)"
          class="absolute top-[9px] right-[8px] !w-[18px] !h-[18px] text-[var(--color-text-1)]"
          icon="iconamoon:close-thin"
          @click.prevent="() => closeTab(v.name)"
        />
      </div>
    </div>
  </a-scrollbar>

  <!-- context menu -->
  <div
    v-show="contextMenuName !== ''"
    class="context-menu"
    :style="`top: ${xy.y}px; left: ${xy.x}px;`"
  >
    <a @click="relush">刷新</a>
    <a @click="closeTab(contextMenuName)">关闭</a>
    <a @click="closeOtherTabs">关闭其他</a>
    <a @click="tabsStore.removeAll">关闭全部</a>
  </div>
</template>

<script setup lang="ts">
import { SvgIcon } from '@vue3/components';
import { useRoute, useRouter } from 'vue-router';
import { computed, nextTick, onBeforeMount, onMounted, ref, toRaw, watch } from 'vue';
import { indexPath, ITab, tabState, useTabsStore } from '../..';

const route = useRoute();
const router = useRouter();

const tabsStore = useTabsStore();

const tabsW = ref(0);
const contextMenuName = ref('');
const xy = ref({
  x: 0,
  y: 0,
});

const tabList = computed(() => tabsStore.tabList);

const toPage = (v: ITab, idx) => {
  const { name, query, state } = v;

  if (name === route.name) return '';

  router.push({
    name,
    query,
    state: state ? JSON.parse(JSON.stringify(state)) : undefined,
  });
};

const relush = () => {
  const replaceIndex = tabsStore.tabList.findIndex((item) => item.name === contextMenuName.value);

  if (replaceIndex > -1) {
    tabState.data = toRaw(tabsStore.tabList[replaceIndex]);
    tabState.replaceIndex = replaceIndex;

    router.replace('/redirect');
    tabsStore.removeTab(contextMenuName.value, false);
  }
};

const closeOtherTabs = () => {
  tabsStore.removeOthers(contextMenuName.value);
};

const closeTab = (routePath: string) => {
  tabsStore.removeTab(routePath);
};

const contextMenuEvent = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();

  const { currentTarget } = e;
  // @ts-ignore
  const { pageX, pageY } = e;
  // @ts-ignore
  const { dataset } = currentTarget;
  const { name } = dataset;

  contextMenuName.value = name || '';
  xy.value = {
    x: pageX,
    y: pageY,
  };
};

const closeContextMenus = () => {
  contextMenuName.value = '';
};

watch(
  [tabList, route],
  () => {
    nextTick(() => {
      const tabs = document.querySelectorAll('.tab-item');

      if (tabs) {
        for (const v of tabs) {
          if (v.classList.contains('last')) continue;

          v.removeEventListener('contextmenu', contextMenuEvent);
          v.addEventListener('contextmenu', contextMenuEvent);
        }
      }
    });
  },
  {
    deep: true,
    immediate: true,
  },
);

onMounted(() => {
  document.addEventListener('click', closeContextMenus, false);

  nextTick(() => {
    const resizeTabW = () => {
      const tabs = document.querySelector('.tabs') as HTMLDivElement;

      if (tabs) {
        tabsW.value = tabs.clientWidth;
      }
    };

    window.addEventListener('resize', resizeTabW);

    resizeTabW();
  });
});

onBeforeMount(() => {
  const tabs = document.querySelectorAll('.tab-item');

  if (tabs) {
    for (const v of tabs) {
      v.removeEventListener('contextmenu', contextMenuEvent);
    }
  }

  document.removeEventListener('click', closeContextMenus, false);
});
</script>

<style lang="scss" scoped>
:deep(.el-scrollbar__view) {
  height: 100%;
}

.tabs {
  @apply bg-[var(--color-bg-2)] flex items-center h-[39px] border-b border-solid border-[var(--color-border)] pl-[20px] box-border;

  &-inner {
    @apply h-[32px] relative whitespace-nowrap mt-2;
  }
}

.tab-item {
  @apply relative text-[var(--color-text-2)] cursor-pointer pl-2 pr-[24px] h-[24px] flex items-center text-[12px] bg-[var(--color-fill-2)] mr-1 select-none;

  border-radius: var(--border-radius-small);

  .svg-icon {
    @apply top-[4px] right-[4px] inline-block;
  }

  &.no-close {
    @apply pr-2;
  }

  &:hover {
    @apply opacity-85;

    .svg-icon {
      @apply block;
    }
  }

  &.active {
    color: rgb(var(--link-6));

    .svg-icon {
      color: rgb(var(--link-6));
    }
  }
}

.context-menu {
  @apply fixed flex flex-col z-50 py-1 rounded-sm;

  background-color: var(--color-bg-popup);
  border: 1px solid var(--color-fill-3);
  border-radius: var(--border-radius-medium);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  a {
    @apply cursor-pointer text-[12px] py-2 px-4;

    color: var(--color-text-1);

    &:hover {
      color: var(--color-text-1);
      background-color: var(--color-fill-2);
      transition: all 0.1s cubic-bezier(0, 0, 1, 1);
    }
  }
}

.hidden-tab {
  display: none !important;
}
</style>
