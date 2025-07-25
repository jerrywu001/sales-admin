import { computed, reactive, Ref, watch } from 'vue';
import { IColumn, ILayoutSizeProps } from '../../types';

export const tableExtraState = reactive({
  /** 布局密度 */
  layoutSize: 'small' as ILayoutSizeProps,
  /** 全部列 */
  allColumns: [] as IColumn[],
  /** 显示列 */
  visibleColumns: [] as IColumn[],
});

export const hiddenColumns = ['index', 'operations'];

export function useTableExtraEffect(originalColumns: Ref<IColumn[]>) {

  const layoutSize = computed(() => tableExtraState.layoutSize);
  const allColumns = computed(() => tableExtraState.allColumns);
  const visibleColumns = computed(() => tableExtraState.visibleColumns);

  watch(
    () => originalColumns.value,
    (newColumns) => {
      const items = JSON.parse(JSON.stringify(newColumns)) as IColumn[];

      for (const v of items) {
        v.checked = true;
      }

      tableExtraState.allColumns = items;
      tableExtraState.visibleColumns = items;
    },
    {
      deep: true,
      immediate: true,
    },
  );

  return {
    layoutSize,
    allColumns,
    visibleColumns,
  };
}
