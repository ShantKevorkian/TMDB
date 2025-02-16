<script setup lang='ts'>
import { watch } from 'vue';
import UIIcon from './UIIcon.vue';

interface Props {
  isOpen: boolean,
  header?: boolean,
  height?: string,
};

const {
  isOpen = false,
  header = false,
  height = 'auto',
} = defineProps<Props>();
const emit = defineEmits(['close']);

watch(() => isOpen, (newVal) => {
  // Prevent scrolling when the menu is open
  if (newVal) {
    document.documentElement.style.overflow = 'hidden';
  } else {
    document.documentElement.style.overflow = '';
  }
});
</script>

<template>
  <Teleport to="body">
    <div
      role="button"
      aria-label="Menu Overlay"
      class="fixed inset-0 z-[9999] lg:hidden"
      :class="isOpen ? 'w-full h-full backdrop-blur-sm' : 'h-0 w-0'"
      @click="emit('close')"
    >
      <Transition name="slide-top-200">
        <div
          v-if="isOpen"
          class="paper-menu"
          :style="{ height }"
          @click.stop
        >
          <div
            v-if="header"
            class="flex flex-col gap-y-3"
          >
            <div
              class="flex items-center"
              :class="[
                { 'justify-end': !$slots['header-title'] },
                { 'justify-between': $slots['header-title'] },
              ]"
            >
              <slot name="header-title" />
              <UIIcon name="close" button @click="emit('close')" />
            </div>
            <hr class="w-[calc(100%+40px)] -ml-5" />
          </div>
          <div v-if="$slots.content" class="flex-1 overflow-y-auto">
            <slot name="content" />
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.paper-menu {
  @apply fixed bottom-0 left-0 flex flex-col gap-y-6;
  @apply pl-[calc(var(--sal)+20px)] pr-[calc(var(--sar)+20px)] pt-[calc(var(--sat)+16px)] pb-[calc(var(--sab)+16px)];
  @apply w-full rounded-t-3xl bg-brand-body border border-gray-300 dark:border-gray-600;
  @apply overflow-hidden z-[9999] max-h-[calc(100%-100px)];
}
</style>
