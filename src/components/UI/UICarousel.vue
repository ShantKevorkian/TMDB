<script setup lang='ts'>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import UICard from './UICard.vue';
import UIIcon from './UIIcon.vue';

const props = defineProps<{ items: Trailer[] }>();

const currentIndex = ref(0);
const totalSlides = computed(() => props.items.length);

const nextSlide = () => {
  // When it's the last slide, go to the first one, like a loop
  currentIndex.value = (currentIndex.value + 1) % totalSlides.value;
};

const prevSlide = () => {
  // When it's the first slide, go to the last one, like a loop
  currentIndex.value = (currentIndex.value - 1 + totalSlides.value) % totalSlides.value;
};

// Handling the swipe on mobile phones
// We don't need a reactive variable here, because we're not using it in the template
let startX = 0;
const handleTouchStart = (event: TouchEvent) => {
  startX = event.touches[0].clientX;
};

const handleTouchEnd = (event: TouchEvent) => {
  const endX = event.changedTouches[0].clientX;
  const diffX = startX - endX;

  if (diffX > 50) nextSlide();
  if (diffX < -50) prevSlide();
};

// Handle keyboard event arrows left and right swipe
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "ArrowRight") nextSlide();
  if (event.key === "ArrowLeft") prevSlide();
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div
    class="relative w-full rounded-2xl overflow-hidden"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <UICard>
      <div class="relative w-full h-full">
        <div
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          
          <div
            v-for="item in items"
            :key="item.id"
            class="w-full flex-shrink-0"
          >
            <slot :item="item" />
          </div>
        </div>
  
        <UIIcon
          name="arrow-left"
          button
          class="absolute left-2 top-1/2 transform -translate-y-1/2 !bg-gray-700/70 text-white p-2 rounded-full"
          @click="prevSlide"
        />
  
        <UIIcon
          name="arrow-right"
          button
          class="absolute right-2 top-1/2 transform -translate-y-1/2 !bg-gray-700/70 text-white p-2 rounded-full"
          @click="nextSlide"
        />
      </div>

      <template #footer>
        <div class="flex justify-center items-center w-full bg-gray-200 dark:bg-gray-600 p-4 lg:p-8 gap-x-2">
          <button
            v-for="(_, index) in items"
            :key="`dot-${index}`"
            type="button"
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="currentIndex === index ? 'bg-gray-700 dark:bg-gray-900 scale-125' : 'bg-gray-400/50 dark:bg-gray-800/50'"
            @click="goToSlide(index)"
          />
        </div>
      </template>
    </UICard>
  </div>
</template>
