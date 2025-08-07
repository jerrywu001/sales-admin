<template>
  <common-app />
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CommonApp, authGlobalState, cleanAuthQuery } from '@core/main';

const route = useRoute();
const router = useRouter();

watch(
  () => authGlobalState.clearAuthSignal,
  (signal) => {
    cleanAuthQuery(signal, router, route);
  },
  { immediate: true },
);
</script>
