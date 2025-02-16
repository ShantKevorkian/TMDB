<script setup lang='ts'>
import { computed, type ComputedRef } from 'vue';

interface Props {
  name: string
  button?: boolean
  disabled?: boolean
  size?: string
  title?: string
};

const {
  name,
  button = false,
  disabled = false,
  size = '24',
  title = '',
} = defineProps<Props>();
const emit = defineEmits(['click']);

const filename: ComputedRef<string> = computed(() => `/src/assets/icons/${name}.svg`);
const filesArr = import.meta.glob('@/assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});
</script>

<template>
  <button
    v-if="button"
    type="button"
    :aria-label="title"
    :disabled="disabled"
    :class="{ 'hover:bg-transparent': disabled }"
    class="inline-flex items-center bg-transparent cursor-pointer"
    @click.stop="!disabled && emit('click')"
  >
    <span
      v-if="filesArr[filename]"
      :style="{ width: `${size}px`, height: `${size}px` }"
      v-html="filesArr[filename]"
    />
  </button>

  <div v-else class="flex">
    <span
      v-if="filesArr[filename]"
      :style="{ width: `${size}px`, height: `${size}px` }"
      v-html="filesArr[filename]"
    />
  </div>
</template>
