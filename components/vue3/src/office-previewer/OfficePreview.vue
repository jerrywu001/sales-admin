<template>
  <OfficePreview :src="url" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { getFileExt } from '@core/tools';

import '@vue-office/docx/lib/index.css';
import '@vue-office/excel/lib/index.css';

const props = defineProps({
  url: {
    type: String,
    default: '',
  },
});

const fileType = computed(() => getFileExt(props.url));

const OfficePreview = defineAsyncComponent({
  loader: () => {
    if (fileType.value === 'pdf') {
      return import('@vue-office/pdf');
    }

    if (['xlsx', 'xls'].includes(fileType.value)) {
      return import('@vue-office/excel');
    }

    if (['docx'].includes(fileType.value)) {
      return import('@vue-office/docx');
    }

    if (['pptx'].includes(fileType.value)) {
      return import('@vue-office/pptx');
    }
  },
});
</script>
