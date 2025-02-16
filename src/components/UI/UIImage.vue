<script setup lang='ts'>
import UISimpleSkeletonLoading from './UISimpleSkeletonLoading.vue';

defineProps<{ 
  item: Movie | Cast | Detail,
  src: string,
  isLoaded?: boolean;
  cover?: boolean;
  rounded?: boolean;
}>();

const emit = defineEmits(['load-image']);
</script>

<template>
  <UISimpleSkeletonLoading v-if="!isLoaded" />
    
  <div
    class="absolute inset-0 transform transition-transform duration-500 group-hover:scale-110"
    :class="{ 'rounded-t-[15px]': rounded }"
  >
    <img
      :src="src"
      :alt="(item as Movie).title"
      class="w-full h-full transition-opacity duration-300"
      :class="{ 'opacity-0': !isLoaded, 'opacity-100': isLoaded, 'object-cover': cover, 'rounded-t-[15px]': rounded }"
      @load="emit('load-image', item.id)"
    />
  </div>
</template>
