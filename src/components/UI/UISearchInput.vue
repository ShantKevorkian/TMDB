<script setup lang='ts'>
import { ref } from 'vue';
import { getLocalStorage, setLocalStorage } from '@/helpers/localStorage';
import UIIcon from './UIIcon.vue';

interface Props {
  placeholder?: string;
  small?: boolean;
  large?: boolean;
  focused?: boolean;
  withBorder?: boolean;
}

defineProps<Props>();
const emit = defineEmits(['input']);

const model = ref<string>(getLocalStorage('search') || '');
const inputEl = ref<HTMLInputElement | null>(null);

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value.trim();
  if (value) {
    setLocalStorage('search', value);
  } else {
    localStorage.removeItem('search');
  }
  emit('input', value);
};
</script>

<template>
  <div
    class="flex items-center gap-2 px-3 w-full"
    :class="{
      'h-8 text-sm': small,
      'h-12 text-lg': large,
      'h-10 text-base': !small && !large,
      'rounded-full border-2 border-gray-300 transition-all focus-within:border-brand-border': withBorder,
    }"
    @click="inputEl && inputEl.focus()"
  >
    <UIIcon name="search" size="20" class="dark:text-white" />
    <input
      ref="inputEl"
      v-model="model"
      type="text"
      :placeholder="placeholder"
      class="w-full bg-transparent outline-none caret-brand-800 dark:caret-white text-brand-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
      @input="handleInput"
    />
  </div>
</template>
