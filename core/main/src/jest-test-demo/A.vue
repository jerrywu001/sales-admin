<template>
  <div>
    <p
      data-testid="clicked"
      data-test="clicked"
    >
      Times clicked: {{ count }}
    </p>
    <button
      data-testid="increment"
      data-test="increment"
      @click="increment"
    >
      increment
    </button>
    <button>主要按钮</button>
    <img
      src="./demo.svg"
      alt="svg"
    >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <circle
        cx="100"
        cy="50"
        r="40"
        stroke="black"
        strokeWidth="2"
        fill="red"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AS',
  setup() {
    const count = ref(0);

    return {
      count,
      increment: () => {
        count.value += 1;
      },
    };
  },
});
</script>
