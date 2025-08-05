<template>
  <div
    class="sms-send-btn"
    :class="{
      disabled: props.disabled || sending,
      mini: sending || loading,
    }"
    @click="emit('send-sms')"
  >
    {{ label }}
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

const emit = defineEmits(['send-sms']);

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  defaultLabel: {
    type: String,
    default: '发送验证码',
  },
  interval: {
    type: Number,
    default: 60,
  },
});

const label = ref(props.defaultLabel);
const sending = ref(false);
const loading = ref(false);
const timer = ref(null);
const times = ref(props.interval);

function clearTimeInterval() {
  times.value = props.interval;
  label.value = props.defaultLabel;
  sending.value = false;
  clearInterval(timer.value);
  timer.value = null;
}

function showLoading() {
  loading.value = true;
  label.value = '发送中...';
}

function hideLoading() {
  loading.value = false;
  label.value = props.defaultLabel;
}

function countdown() {
  if (props.disabled || sending.value) return;

  clearTimeInterval();

  sending.value = true;
  loading.value = false;
  label.value = `${times.value}s重新发送`;
  timer.value = setInterval(() => {
    if (times.value <= 1) {
      sending.value = false;
      clearTimeInterval();
    } else {
      label.value = `${--times.value}s重新发送`;
    }
  }, 1000);
}

defineExpose({
  showLoading,
  hideLoading,
  clearTimeInterval,
  countdown,
  sending,
  loading,
});

onBeforeUnmount(() => {
  clearTimeInterval();
});
</script>

<style lang="scss">
.sms-send-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--color-primary);
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
  position: absolute;
  top: 0;
  left: 300px;
  width: 100px;
  height: 40px;
  font-size: 14px;
  color: var(--color-primary);

  &:hover {
    opacity: 0.75;
  }

  &.disabled {
    pointer-events: none;
    color: #b8bfc3;
    background-color: #f2f5fa;
    border: 1px solid #f2f5fa;

    &:hover {
      opacity: 1;
    }
  }

  &.mini {
    font-size: 12px;
  }
}
</style>
