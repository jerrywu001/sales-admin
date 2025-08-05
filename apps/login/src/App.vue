<template>
  <not-support-browser v-if="!!error" :error="error" />
  <router-view v-else />

  <message-box />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCheckBrowser, NotSupportBrowser, MessageBox } from '@vue3/components';

const error = useCheckBrowser();

onMounted(() => {
  document.documentElement.classList.add('dark');
  document.body.setAttribute('arco-theme', 'dark');
});
</script>
