<template>
  <a-card class="p-0" :title="title">
    <slot name="search-buttons" />

    <div class="pb-4 flex items-center justify-between">
      <div class="flex justify-start gap-2">
        <slot name="left-buttons" />
      </div>

      <div class="flex gap-2 items-center justify-end">
        <slot name="right-buttons" />
      </div>
    </div>

    <slot />

    <div class="flex justify-end pt-4">
      <slot name="footer" />
    </div>
  </a-card>
</template>

<script setup lang="ts">
defineOptions({ name: 'ContentContainer' });

const slots = defineSlots();

defineProps({
  /** content 区域的标题 */
  title: {
    type: String,
    required: false,
    default: '',
  },
});

</script>

<style scoped lang="scss">
:deep(.arco-card-header) {
  border-bottom: none;
}

:deep(.tl-row) {
  padding-bottom: 6px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--color-border);
}
</style>
