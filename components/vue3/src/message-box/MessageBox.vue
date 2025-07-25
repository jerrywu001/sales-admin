<template>
  <div v-if="messageBoxState" class="message-box-layer" @click="clickLayer" />
  <div v-if="messageBoxState" class="message-box-wrapper">
    <div class="message-box-header">
      <span>{{ config.title }}</span>

      <div v-if="config.showClose" class="message-box-close" @click="onClose">
        <svg-icon icon="ic:round-close" />
      </div>
    </div>

    <div class="message-box-content" :class="{ '!pl-4': !icon }">
      <svg-icon v-if="icon" :icon="icon" :class="config.type" />
      <Content />
    </div>

    <div class="message-box-footer">
      <Button @click="onClose">
        {{ config.cancelText }}
      </Button>
      <Button type="primary" :loading="loading" @click="onConfirm">
        {{ config.okText }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IMessageBoxValues, messageBoxState, SvgIcon } from '../..';
import { computed, ref, h } from 'vue';
import { Button, Message } from '@arco-design/web-vue';
import { isNull } from '@core/tools';

const icons = {
  success: 'ep:success-filled',
  info: 'mdi:information-variant-circle',
  warning: 'mdi:warning-circle',
  danger: 'fluent:error-circle-16-filled',
};

const loading = ref(false);

const config = computed(() => messageBoxState.value || {} as IMessageBoxValues);

const icon = computed(() => icons[config.value.type] || null);

const Content = computed(() => {
  if (isNull(config.value.message)) return null;

  if (typeof config.value.message === 'string') return h('span', {}, config.value.message);

  return config.value.message;
});

const onClose = () => {
  messageBoxState.value = null;

  if (config.value.onCancel) {
    config.value.onCancel();
  }
};

const onConfirm = async () => {
  loading.value = true;

  if (config.value.onOk) {
    try {
      await config.value.onOk();

      messageBoxState.value = null;
    } catch (error) {
      if (error instanceof Error) {
        Message.error(error.message);
      }
    }
  }

  loading.value = false;
};

const clickLayer = (e: Event) => {
  e.stopPropagation();

  if (!config.value.closeOnClickModal) return;

  onClose();
};

</script>

<style scoped lang="scss">
.message-box {
  &-layer {
    @apply fixed bg-[rgba(0,0,0,0.5)] z-[2000] w-screen h-screen top-0 left-0;
  }

  &-wrapper {
    @apply fixed w-[400px] bg-[var(--color-bg-2)] rounded z-[2001] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%];
  }

  &-header {
    @apply flex justify-between items-center px-[16px] py-2;

    span {
      @apply text-[18px] text-[var(--color-text-1)] font-[500];
    }
  }

  &-close {
    @apply cursor-pointer w-8 h-8 flex justify-end items-center;

    .svg-icon {
      @apply w-5 h-5;

      path {
        fill: var(--color-text-1) !important;
      }
    }
  }

  &-content {
    @apply relative text-[var(--color-text-2)] p-[16px] pt-[10px] pl-[50px] flex items-center gap-2;
  }

  &-footer {
    @apply flex justify-end gap-2 p-[16px] pt-0;
  }
}

:deep(.message-box-content .svg-icon) {
  width: 26px !important;
  height: 26px !important;
  position: absolute;
  top: 8px;
  left: 14px;
}

:deep(.message-box-close path) {
  fill: var(--color-text-2) !important;
}

:deep(.message-box-close:hover .svg-icon path) {
  fill: var(--color-text-2) !important;
}

:deep(.svg-icon.info path) {
  fill: rgb(var(--primary-6)) !important;
}

:deep(.svg-icon.success path) {
  fill:rgb(var(--success-6)) !important;
}

:deep(.svg-icon.warning path) {
  fill: rgb(var(--warning-6)) !important;
}

:deep(.svg-icon.danger path) {
  fill: rgb(var(--danger-6)) !important;
}
</style>
