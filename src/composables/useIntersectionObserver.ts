import { onMounted, onUnmounted, ref, type Ref } from 'vue';

export function useIntersectionObserver(
  target: Ref<HTMLElement | null>,
  callback: () => void | Promise<void>,
  options: IntersectionObserverInit = { root: null, rootMargin: '0px 0px', threshold: 0 }
) {
  const observer = ref<IntersectionObserver | null>(null);

  onMounted(() => {
    if (!target.value) return;

    observer.value = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        await callback();
        // Scroll up a bit to trigger the intersection observer again
        window.scrollTo(0, window.scrollY - 2);
      }
    }, options);

    observer.value.observe(target.value);
  });

  onUnmounted(() => {
    if (observer.value && target.value) {
      observer.value.unobserve(target.value);
      observer.value.disconnect();
    }
  });
};
