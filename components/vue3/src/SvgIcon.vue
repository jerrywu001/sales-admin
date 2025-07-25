<template>
  <div class="svg-icon">
    <Icon :icon="icon" />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps({
  /**
   * icon class name
   * @description 可以去 https://icon-sets.iconify.design/ 搜索
   */
  icon: {
    type: String,
    default: '',
  },
});
</script>

<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
  width: 22px;
  height: 22px;
  overflow: hidden;

  svg {
    fill: currentcolor;
    width: 100%;
    height: 100%;
  }
}
</style>
