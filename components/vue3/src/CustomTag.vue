<template>
  <div class="inline-block text-[12px]">
    <div class="flex items-center">
      <div class="custom-tag-status" :class="type">
        {{ label }}
      </div>

      <a-popover v-if="desc" :content-class="`${dark ? 'dark' : ''}`">
        <svg-icon
          icon="mdi:warning-circle"
          class="cursor-pointer text-[rgb(var(--danger-6))] ml-1 !w-4 !h-4"
        />
        <template #content>
          <div class="max-w-[460px] whitespace-pre-wrap">
            {{ desc }}
          </div>
        </template>
      </a-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { SvgIcon } from '..';

defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String as PropType<'info' | 'success' | 'warning' | 'danger' | 'primary'>,
    default: 'info',
  },
  desc: {
    type: String,
    default: '',
    required: false,
  },
  dark: {
    type: Boolean,
    default: true,
    required: false,
  },
});
</script>

<style lang="scss">
.arco-popover-popup-content.dark {
  &,
  & + .arco-popover-popup-arrow {
    background-color: rgb(0, 0, 0, 0.85) !important;
    color: white !important;
  }
}
</style>

<style scoped lang="scss">
.custom-tag-status {
  @apply inline-block rounded px-2 border min-w-[66px] text-center;

  &.info {
    @apply text-[var(--color-text-2)] border-[var(--color-text-4)];
  }

  &.success {
    @apply text-[rgb(var(--success-6))] border-[rgb(var(--success-6))];
  }

  &.warning {
    @apply text-[rgb(var(--warning-6))] border-[rgb(var(--warning-6))];
  }

  &.danger {
    @apply text-[rgb(var(--danger-6))] border-[rgb(var(--danger-6))];
  }

  &.primary {
    @apply text-[rgb(var(--primary-6))] border-[rgb(var(--primary-6))];
  }
}
</style>
