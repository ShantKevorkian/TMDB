<script setup lang='ts'>

interface Props {
  size?: string,
};

const {
  size = '32px',
} = defineProps<Props>();
</script>

<template>
  <div class="loading-spinner" :style="{ '--size': size }" />
</template>

<style scoped>
.loading-spinner {
  @apply relative flex justify-center items-center w-full h-full;
}

.loading-spinner:after {
  position: absolute;
  left: calc(50% - var(--size) / 2);
  content: " ";
  display: block;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  border: 3px solid;
  animation: spin 600ms linear infinite;
  @apply border-[#013A63_transparent_transparent_#013A63];
  @apply dark:border-[#FFFFFF_transparent_transparent_#FFFFFF];
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
