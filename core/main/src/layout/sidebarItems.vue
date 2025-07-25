<template>
  <template
    v-if="!item.hidden"
  >
    <template
      v-if="item.children && item.children.length > 0"
    >
      <el-sub-menu
        :index="item.name"
        :class="[{ 'no-icon': !item.meta.icon }]"
      >
        <template #title>
          <svg-icon
            :icon="item.meta.icon"
          />
          <span>{{ item.meta.title || item.name }}</span>
        </template>

        <sidebar-items
          v-for="child in item.children"
          :key="child.name"
          :item="child"
        />
      </el-sub-menu>
    </template>
    <el-menu-item
      v-else
      :index="item.name"
      :style="`margin-top: ${topSplit ? 9 : 0}px`"
      :class="[{ 'no-icon': !item.meta.icon }]"
      @click="doRedirect(item)"
    >
      <template v-if="item.meta.icon">
        <svg-icon :icon="item.meta.icon" />
      </template>
      <span v-if="item.isThird" class="menu-circle" />
      <span>{{ item.meta.title || item.name }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { ISidebarMenu } from '@core/api';
import { SvgIcon } from '@vue3/components';
import { useRouter } from 'vue-router';
import { ElMenuItem, ElSubMenu } from 'element-plus';

defineOptions({ name: 'SidebarItems' });

defineProps({
  item: {
    type: Object as PropType<ISidebarMenu>,
    required: true,
  },
  topSplit: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();

const doRedirect = (item: ISidebarMenu) => {
  if (item?.redirect) {
    router.push(item.redirect);
    return;
  }

  if (item.layout === 'blank') {
    window.open(item.name, '_blank');
    return;
  }

  router.push({ name: item.name });
};
</script>

<style lang="scss">
.el-menu-item {
  .menu-circle {
    @apply rounded-[50%] border-[var(--color-text-1)] border border-solid h-[8px] w-[6px];
  }

  &.no-icon {
    .svg-icon {
      display: none;
    }

    & > span {
      padding-left: 6px;
    }
  }

  &.is-active {
    & > .menu-circle,
    & > .svg-icon,
    & > span {
      color: rgb(var(--primary-6)) !important;
      border-color: rgb(var(--primary-6));
    }

    & > .menu-circle {
      background-color: rgb(var(--primary-6));
    }
  }
}

.el-sub-menu {
  &.no-icon {
    .el-sub-menu__title {
      .svg-icon {
        display: none;
      }

      & > span {
        padding-left: 6px;
      }
    }
  }
}
</style>
