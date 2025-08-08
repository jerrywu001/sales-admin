<template>
  <content-container title="职位管理">
    <template #search-buttons>
      <!-- 搜索条件区域 -->
      <search-container>
        <search-col>
          <a-input v-model="params.payeeNo" placeholder="职位名称" allow-clear @keyup.enter="doSearch" />
        </search-col>
        <search-col>
          <a-input v-model="params.name" placeholder="职位编号" allow-clear @keyup.enter="doSearch" />
        </search-col>
        <search-col>
          <a-select v-model="params.status" allow-clear placeholder="状态">
            <a-option value="ENABLED">
              启用
            </a-option>
            <a-option value="DISABLED">
              禁用
            </a-option>
          </a-select>
        </search-col>
        <search-col>
          <a-range-picker
            v-model="dateRange"
            allow-clear
            type="daterange"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: calc(100% - 4px)"
            :placeholder="['创建时间(起)', '创建时间(止)']"
            @keydown.enter="doSearch"
          />
        </search-col>

        <template #buttons>
          <a-button @click="resetForm">
            <svg-icon icon="tabler:refresh" />重置
          </a-button>
          <a-button type="primary" @click="doSearch">
            <svg-icon icon="lucide:search" />查询
          </a-button>
        </template>
      </search-container>
    </template>

    <template #left-buttons>
      <a-button v-permission="['air:split:payee:add']" type="primary">
        <svg-icon icon="lucide:circle-plus" />新增
      </a-button>
    </template>

    <template #right-buttons>
      <table-extra-effect @search="doSearch" />
    </template>

    <a-table
      :loading="loading"
      :columns="visibleColumns"
      :data="tableData"
      :size="layoutSize"
      :stripe="tableConfig.stripe"
      :scroll="{ x: 1 }"
      :column-resizable="tableConfig.columnResizable"
      :hoverable="tableConfig.hoverable"
      :bordered="tableConfig.bordered"
      :pagination="tableConfig.pagination"
    >
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 + (params.page - 1) * params.size }}
      </template>

      <template #payeeNo="{ record }">
        <a>{{ record.payeeNo }}</a>
      </template>

      <template #status="{ record }">
        <a-switch v-model="record.status" checked-value="ENABLED" unchecked-value="DISABLED" />
      </template>

      <template #operations>
        <div class="sys-table-links">
          <a class="sys-link" type="text">
            删除
          </a>
        </div>
      </template>
    </a-table>

    <template #footer>
      <a-pagination
        v-model:current="params.page"
        v-model:page-size="params.size"
        :size="layoutSize"
        :total="total"
        :page-size-options="[defaultPageSize, 25, 50, 100]"
        show-total
        show-jumper
        show-page-size
        @page-size-change="onSizeChange"
        @change="onCurrentPageChange"
      />
    </template>
  </content-container>
</template>

<script lang="ts" setup>
import { SvgIcon } from '@vue3/components';
import { Message } from '@arco-design/web-vue';
import { computed, ref, reactive } from 'vue';
import { getRangeDates, ITimeRanger } from '@core/tools';
import { ITestTableParam, defaultPageSize, IPayeeItem, IColumn } from '@core/main/types';
import { ContentContainer, SearchContainer, SearchCol, TableExtraEffect, useTableExtraEffect, queryPayees, GlobalSiteConfig } from '@core/main';

defineOptions({ name: 'SystemJobs' });

const params = reactive<ITestTableParam>({
  page: 1,
  size: defaultPageSize,
});

const total = ref(0);
const loading = ref(false);
const dateRange = ref<ITimeRanger | []>([]);
const tableData = ref<IPayeeItem[]>([]);

const tableConfig = computed(() => GlobalSiteConfig.table);
const allColumns = computed(() => [
  tableConfig.value.showIndexColumn
    ? {
      title: '#',
      dataIndex: 'index',
      slotName: 'index',
      width: tableConfig.value.columnWidth,
    }
    : null,
  {
    title: '职位编号',
    dataIndex: 'payeeNo',
    minWidth: 250,
  },
  {
    title: '职位名称',
    dataIndex: 'name',
    minWidth: 250,
  },
  {
    title: '备注',
    dataIndex: 'payeeType',
    minWidth: 350,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
    minWidth: 250,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    minWidth: 250,
  },
  {
    title: '操作',
    align: 'center',
    fixed: 'right',
    dataIndex: 'operations',
    slotName: 'operations',
    width: 112,
  },
].filter(Boolean) as IColumn[]);

const {
  layoutSize,
  visibleColumns,
} = useTableExtraEffect(allColumns);

function getQueryParams() {
  const ranges = getRangeDates(dateRange.value);

  return {
    ...params,
    startTime: ranges[0] || undefined,
    endTime: ranges[1] || undefined,
  };
}

async function fetchData() {
  loading.value = true;

  try {
    const { data, total: all } = await queryPayees(getQueryParams());

    tableData.value = data;
    total.value = all;
  } catch (error) {
    if ((error as Error).message) Message.error((error as Error).message);
  }

  loading.value = false;
}

function onSizeChange(size: number) {
  params.size = size;
  params.page = 1;
  fetchData();
}

function onCurrentPageChange(page: number) {
  params.page = page;
  fetchData();
}

function doSearch() {
  params.page = 1;
  fetchData();
}

function resetForm() {
  dateRange.value = [];

  for (const key in params) {
    if (!['page', 'size'].includes(key)) {
      params[key] = undefined;
    }
  }
}

fetchData();
</script>
