<script setup lang='ts'>
interface Props {
  title: string,
  component?: string,
};

const {
  component = 'h1',
} = defineProps<Props>();
</script>

<template>
  <component
    :is="component"
    :title="title"
    class="font-bold text-brand-800 dark:text-white"
    :class="{
      'text-2xl': component === 'h1',
      'text-xl': component === 'h2',
      'text-lg': component === 'h3',
      'text-base': component === 'h4',
      'text-sm': component === 'h5',
      'text-xs': component === 'h6',
    }"
  >
    {{ title }}
  </component>
</template>
