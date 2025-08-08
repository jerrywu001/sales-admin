<template>
  <not-support-browser v-if="!!error" :error="error" />
  <router-view v-else />

  <message-box />
</template>

<script setup lang="ts">
import { useCheckBrowser, NotSupportBrowser, MessageBox } from '@vue3/components';

const error = useCheckBrowser();
</script>
