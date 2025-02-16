<script setup lang='ts'>
import { ref, onMounted, onUnmounted } from 'vue';

defineProps<{
  name: string;
  items: Movie[];
}>();

const visibleIds = ref<Record<string | number, boolean>>({});
const itemsRefs = ref<(Element | null)[]>([]);
const heights = ref<Record<string | number, number>>({});

let observer: IntersectionObserver | null = null;

const startObserving = () => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        if (!id) return;

        heights.value[id] = entry.target.getBoundingClientRect().height;

        if (entry.isIntersecting) visibleIds.value[id] = true;
        else delete visibleIds.value[id];
      });
    },
    {
      // The root margin where the intersection observer starts observing
      rootMargin: '300px 0px',
      threshold: [0, 1.0],
    }
  );

  // Start observing each item
  itemsRefs.value.forEach((itemRef) => {
    if (itemRef) observer?.observe(itemRef);
  });
};

const stopObserving = () => {
  if (observer) {
    // Stop observing each item
    itemsRefs.value.forEach((itemRef) => {
      if (itemRef) observer?.unobserve(itemRef);
    });
    observer.disconnect();
    observer = null;
  }
};

const storeRef = (el: Element | null, idx: number) => {
  if (el) {
    // If the item already exists, stop observing it
    if (itemsRefs.value[idx]) {
      observer?.unobserve(itemsRefs.value[idx]!);
    }
    // Store the new item and start observing it
    itemsRefs.value[idx] = el;
    observer?.observe(el);
  }
};

const isVisible = (id: string | number) => {
  if (!visibleIds.value[id]) return false;
  return true;
};

const getPostHeight = (id: string | number) => `${heights.value[id] || 0}px`;

onMounted(startObserving);
onUnmounted(stopObserving);
</script>

<template>
  <div
    v-for="(item, index) in items"
    :id="`${item.id}`"
    :key="item.id"
    :ref="(el) => storeRef(el as Element, index)"
    :data-index="index"
  >
    <div v-if="isVisible(item.id)" class="items-visible h-full">
      <slot name="visible" :item="item" :index="index" />
    </div>
    <div v-else :style="{ height: getPostHeight(item.id), opacity: 0, overflow: 'hidden' }">
      <slot name="hidden" :item="item" :index="index" />
    </div>
  </div>
</template>

<style scoped>
.item-visible {
  animation: fade 50ms linear;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 100%;
  }
}
</style>
