<script setup lang='ts'>
import { RouterView } from 'vue-router';
import Theme from './components/TheTheme.vue';
</script>

<template>
  <Theme />
  <main class="w-full h-full max-w-screen-2xl mx-auto bg-brand-body transition-colors duration-300">
    <RouterView v-slot="{ Component, route }">
      <transition name="fade-300">
        <component :is="Component" :key="route.path" />
      </transition>
    </RouterView>
  </main>
</template>
