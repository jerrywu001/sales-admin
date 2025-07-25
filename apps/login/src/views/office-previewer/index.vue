<template>
  <office-preview :url="fileUrl" />
</template>

<script setup lang="ts">
import { OfficePreview } from '@vue3/components';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const fileUrl = computed(() => {
  return route.query.url as string;
});
</script>
