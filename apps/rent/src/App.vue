<template>
  <common-app />
</template>

<script setup lang="ts">
import { nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CommonApp, authGlobalState } from '@core/main';
import { removeSecureState } from '@core/api';

const route = useRoute();
const router = useRouter();

watch(
  () => authGlobalState.clearAuthSignal,
  (signal) => {
    if (!signal) return;

    removeSecureState();

    nextTick(() => {
      setTimeout(() => {
        router.replace({
          path: route.path,
          query: {
            ...route.query,
            code: undefined,
            state: undefined,
          },
        });
      }, 500);
    });
  },
  { immediate: true },
);
</script>
