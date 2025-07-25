<template>
  <a-breadcrumb class="flex items-center pb-3">
    <a-breadcrumb-item class="flex items-center">
      <svg-icon icon="nrk:category" class="!w-4" />
    </a-breadcrumb-item>

    <a-breadcrumb-item
      v-for="(v, idx) in menusStore.breadcrumbs"
      :key="idx"
      :class="[{ active: idx === menusStore.breadcrumbs.length - 1 }]"
    >
      {{ v.meta?.title }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import { SvgIcon } from '@vue3/components';
import { useMenusStore } from '../..';

const { state: menusStore } = useMenusStore();
</script>
