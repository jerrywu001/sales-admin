<template>
  <not-support-browser v-if="!!error" :error="error" />
  <a-config-provider v-else :locale="zhCn">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { ConfigProvider as AConfigProvider } from '@arco-design/web-vue';
import { NotSupportBrowser, useCheckBrowser } from '@vue3/components';
import zhCn from '@arco-design/web-vue/es/locale/lang/zh-cn';

const error = useCheckBrowser();
</script>
