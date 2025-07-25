<template>
  <div
    ref="rowRef"
    class="tl-row"
    :class="[
      {'opacity-0': !visible}
    ]"
  >
    <slot class="test" />

    <template v-if="opened || total < onLineCols">
      <div
        v-for="index of extraItemCount"
        :key="index"
        class="tl-col adjust"
      >
      &nbsp;
      </div>
    </template>

    <div class="sce-buttons tl-btn-col adjust">
      <a-button
        v-if="showToogleBtn"
        class="mr-2"
        type="text"
        @click="opened = !opened"
      >
        {{ !opened ? '展开' : '收起' }}
        <svg-icon
          v-if="!opened"
          icon="ep:arrow-down"
        />
        <svg-icon
          v-else
          icon="ep:arrow-up"
        />
      </a-button>

      <div class="flex flex-row-reverse gap-2">
        <slot name="buttons" class="ssss" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SvgIcon } from '@vue3/components';
import { useWindowSize } from '@vueuse/core';
import { computed, onMounted, ref, watch } from 'vue';

defineOptions({ name: 'SearchContainer' });

/**
 * 对应apps\main\tailwind.config.cjs中定义的尺寸
 */
const sizeMap = {
  x1: 1350,
  x2: 1600,
  xx: 1780,
};

const extraItemCount = ref(0);

const { width } = useWindowSize();

const onLineCols = computed(() => {
  if (width.value >= sizeMap.x1 && width.value < sizeMap.x2) {
    return 4;
  }

  if (width.value >= sizeMap.x2 && width.value < sizeMap.xx) {
    return 5;
  }

  if (width.value >= sizeMap.xx) {
    return 6;
  }

  return 3;
});

const rowRef = ref(null);
const visible = ref(false);
const showToogleBtn = ref(false);

const opened = ref(false);
const total = ref(0);

const initDom = () => {
  const container = rowRef.value;

  if (!container) return;

  const cols = container.querySelectorAll('.tl-col') as HTMLDivElement[];
  let visibleLen = 0;

  total.value = cols.length;

  cols.forEach((item, idx) => {
    const itemIdx = idx + 1;

    item.dataset.index = String(itemIdx);

    if (itemIdx > onLineCols.value - 1 && !opened.value) {
      item.style.display = 'none';
    } else {
      visibleLen += 1;
      item.style.display = 'block';
    }
  });

  const lines = Math.ceil((total.value + 1) / onLineCols.value);

  showToogleBtn.value = lines > 1;
  extraItemCount.value = lines * onLineCols.value - total.value - 1;
};

watch(
  [width, opened],
  () => {
    initDom();
  },
);

onMounted(() => {
  initDom();

  visible.value = true;
});
</script>

<style lang="scss" scoped>
.tl-row {
  @apply flex relative box-border flex-wrap ml-[-8px] mr-[-3px];
}

.tl-col,
.tl-btn-col {
  @apply relative box-border block flex-grow-0 flex-shrink-0 pl-2 pr-[4px] mb-4 text-right;
}

.sce-buttons {
  @apply flex justify-end;

  :deep(.a-button) {
    width: 68px !important;
    margin: 0;
  }

  :deep(.a-button.is-link) {
    width: 60px !important;
    height: 30px;
  }
}
</style>
