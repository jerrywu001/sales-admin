<template>
  <content-container title="员工管理">
    <template #search-buttons>
      <!-- 搜索条件区域 -->
      <search-container>
        <search-col>
          <a-input v-model="params.payeeNo" placeholder="收款方编号" allow-clear @keyup.enter="doSearch" />
        </search-col>
        <search-col>
          <a-input v-model="params.name" placeholder="收款方名称" allow-clear @keyup.enter="doSearch" />
        </search-col>
        <search-col>
          <a-input v-model="params.channelType" placeholder="通道类型" allow-clear @keyup.enter="doSearch" />
        </search-col>
        <search-col>
          <a-input v-model="params.payeeType" placeholder="收款方类型" allow-clear @keyup.enter="doSearch" />
        </search-col>
        <search-col>
          <a-input v-model="params.status" placeholder="状态" allow-clear @keyup.enter="doSearch" />
        </search-col>
        <search-col>
          <a-range-picker
            v-model="dateRange"
            type="daterange"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: calc(100% - 4px)"
            :placeholder="['创建时间(起)', '创建时间(止)']"
            @keydown.enter="doSearch"
          />
        </search-col>
        <search-col>
          <a-input v-model="params.failReason" placeholder="失败原因" allow-clear @keyup.enter="doSearch" />
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

      <a-button type="primary">
        <svg-icon icon="gridicons:phone" />手机端注册
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

      <template #status="{ record }">
        <custom-tag
          :label="PayeeStatusLabel[record.status]"
          :type="PayeeStatusColor[record.status]"
        />
      </template>

      <template #operations>
        <div class="sys-table-links">
          <a class="sys-link" type="text">
            查看
          </a>
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
import { SvgIcon, CustomTag } from '@vue3/components';
import { Message } from '@arco-design/web-vue';
import { computed, ref, reactive } from 'vue';
import { getRangeDates, ITimeRanger } from '@core/tools';
import { ITestTableParam, defaultPageSize, IPayeeItem, IColumn, PayeeStatusColor, PayeeStatusLabel } from '@core/main/types';
import { ContentContainer, SearchContainer, SearchCol, TableExtraEffect, useTableExtraEffect, queryPayees, GlobalSiteConfig } from '@core/main';

defineOptions({ name: 'SystemUsers' });

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
    title: '收款方编号',
    dataIndex: 'payeeNo',
    minWidth: 250,
  },
  {
    title: '收款方名称',
    dataIndex: 'name',
    minWidth: 250,
  },
  {
    title: '通道类型',
    dataIndex: 'channelType',
    minWidth: 250,
  },
  {
    title: '收款方类型',
    dataIndex: 'payeeType',
    minWidth: 250,
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
    title: '失败原因',
    minWidth: 250,
    ellipsis: true,
    tooltip: true,
    dataIndex: 'failReason',
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
