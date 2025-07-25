<template>
  <div class="tl-col adjust">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.tl-col {
  @apply relative box-border block flex-grow-0 flex-shrink-0 pl-2 pr-[4px] mb-4;
}
</style>

<style lang="scss">
.adjust {
  @apply max-w-[33.333%] basis-1/3 2xl:max-w-[25%] 2xl:basis-1/4 3xl:max-w-[20%] 3xl:basis-1/5 xxl:max-w-[16.6666%] xxl:basis-1/6;
}
</style>
