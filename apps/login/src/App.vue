<template>
  <not-support-browser v-if="!!error" :error="error" />
  <router-view v-else />
</template>

<script setup lang="ts">
import { useCheckBrowser, NotSupportBrowser } from '@vue3/components';

const error = useCheckBrowser();
</script>
