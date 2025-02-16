<script setup lang='ts'>
import { ref } from 'vue';
import { getLocalStorage, setLocalStorage } from '@/helpers/localStorage';
import UIIcon from './UI/UIIcon.vue';

const isDark = ref<boolean>(getLocalStorage('theme') === 'dark');

const addToDocumentElement = () => {
  document.documentElement.classList.toggle('dark', isDark.value);
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
};

!getLocalStorage('theme') ? setLocalStorage('theme', 'light') : addToDocumentElement();

const handleThemeChange = () => {
  isDark.value = !isDark.value;
  addToDocumentElement();
  if (!isDark.value) {
    document.documentElement.style.removeProperty('background-color');
  }
  setLocalStorage('theme', isDark.value ? 'dark' : 'light');
};
</script>

<template>
  <div class="flex justify-center items-center fixed top-4 lg:top-6 right-6 h-[60px] z-[9999]">
    <UIIcon
      :name="isDark ? 'sun' : 'moon'"
      button
      class="w-10 h-10 justify-center !bg-white/70 dark:!bg-gray-800/70 rounded-full backdrop-blur border border-gray-300 dark:border-gray-600 dark:text-white"
      @click="handleThemeChange"
    />
  </div>
</template>
