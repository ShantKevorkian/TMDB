<script setup lang='ts'>
defineProps({
  clickable: Boolean,
});
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-gray-400 dark:border-gray-600 dark:bg-gray-800 overflow-hidden shadow-xl"
    :class="{ 'cursor-pointer': clickable }"
  >
    <div class="flex flex-col h-full rounded-[15px]">
      <slot name="header" />
      <slot />
      <div v-if="$slots.footer" class="flex grow">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
