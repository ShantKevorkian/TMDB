<script setup lang='ts'>
import UITitle from '@/components/UI/UITitle.vue';
</script>

<template>
  <div class="flex items-center justify-center min-h-svh p-6 text-brand-800 dark:text-white">
    <div class="flex flex-col items-center space-y-4">
      <UITitle title="404 Not Found" />
      <UITitle title="The page you are looking for does not exist." component="h2" class="text-center" />
      <router-link to="/" class="font-bold text-xl underline">Go to Home</router-link>
    </div>
  </div>
</template>
