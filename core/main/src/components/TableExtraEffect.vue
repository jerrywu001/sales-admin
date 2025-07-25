<template>
  <div class="flex items-center justify-end gap-1">
    <a-tooltip content="刷新">
      <div class="action-icon" @click="doSearch">
        <svg-icon icon="tabler:refresh" />
      </div>
    </a-tooltip>

    <a-dropdown @select="onLayoutSizeChange">
      <a-tooltip content="密度">
        <div class="action-icon">
          <svg-icon icon="tabler:line-height" />
        </div>
      </a-tooltip>
      <template #content>
        <a-doption
          v-for="item in densityList"
          :key="item.value"
          :value="item.value"
          :class="{ active: item.value === size }"
        >
          <span>{{ item.name }}</span>
        </a-doption>
      </template>
    </a-dropdown>

    <a-tooltip content="列设置">
      <a-popover
        trigger="click"
        position="br"
        @popup-visible-change="toggleColumnsPopup"
      >
        <div class="action-icon">
          <svg-icon icon="tabler:settings" />
        </div>
        <template #content>
          <div ref="tableSetting">
            <template v-for="(item) in tableExtraState.allColumns" :key="item.dataIndex">
              <div
                v-if="!hiddenColumns.includes(item.dataIndex)"
                class="arco-column-settings"
              >
                <div style="margin-right: 4px; cursor: move">
                  <svg-icon icon="lsicon:move-filled" class="!w-4" />
                </div>

                <a-checkbox
                  v-model="item.checked"
                  @change="toggleColumnVisible($event, item as IColumn)"
                />
                <div class="title">
                  {{ item.title === '#' ? '序列号' : item.title }}
                </div>
              </div>
            </template>
          </div>
        </template>
      </a-popover>
    </a-tooltip>
  </div>
</template>

<script lang="ts" setup>
import Sortable from 'sortablejs';
import { SvgIcon } from '@vue3/components';
import { computed, nextTick, ref } from 'vue';
import type { ILayoutSizeProps, IColumn } from '../../types';
import { tableExtraState, hiddenColumns } from '../composables/useTableExtraEffect';
import { GlobalSiteConfig } from '../..';

const emit = defineEmits(['search']);

const size = computed(() => tableExtraState.layoutSize);
const tableConfig = computed(() => GlobalSiteConfig.table);

const densityList = [
  {
    name: '迷你',
    value: 'mini',
  },
  {
    name: '偏小',
    value: 'small',
  },
  {
    name: '中等',
    value: 'medium',
  },
  {
    name: '偏大',
    value: 'large',
  },
];

const tableSetting = ref<HTMLElement>();

const toggleColumnVisible = (
  checked: boolean,
  column: IColumn,
) => {
  const visibleColumns = [] as IColumn[];
  const { dataIndex } = column;

  for (const v of tableExtraState.allColumns) {
    if (v.dataIndex === dataIndex) {
      v.checked = checked;
    }

    if (v.checked) {
      visibleColumns.push(v);
    }
  }

  tableExtraState.visibleColumns = visibleColumns;
};

const toggleColumnsPopup = (val: boolean) => {
  if (val) {
    nextTick(() => {
      const el = tableSetting.value as HTMLElement;

      new Sortable(el, {
        onEnd(e: any) {
          const add = tableConfig.value.showIndexColumn ? 1 : 0;
          const { oldIndex, newIndex } = e;
          const realOldIndex = oldIndex + add; // 存在序号列，所以要+1
          const realNewIndex = newIndex + add;

          // 先排序allColumns，再同步visibleCOlumns
          const allColumns = JSON.parse(JSON.stringify(tableExtraState.allColumns)) as IColumn[];

          if (realNewIndex < realOldIndex) {
            allColumns.splice(realNewIndex, 0, allColumns[realOldIndex]);
            allColumns.splice(realOldIndex + 1, 1);
          } else if (realNewIndex > realOldIndex) {
            allColumns.splice(realNewIndex + 1, 0, allColumns[realOldIndex]);
            allColumns.splice(realOldIndex, 1);
          }

          tableExtraState.allColumns = allColumns;
          tableExtraState.visibleColumns = allColumns.filter((v) => v.checked);
          console.log(realOldIndex, realNewIndex, allColumns);
        },
      });
    });
  }
};

const onLayoutSizeChange = (val: ILayoutSizeProps) => {
  tableExtraState.layoutSize = val;
};

const doSearch = () => {
  emit('search');
};
</script>

<style lang="scss" scoped>
.action-icon {
  @apply cursor-pointer h-7 w-7 flex items-center justify-center;

  .svg-icon {
    @apply w-5 h-5;
  }
}

.arco-dropdown-option.active {
  @apply bg-[var(--color-gray-bg)];
}

.arco-column-settings {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
  }
}
</style>

