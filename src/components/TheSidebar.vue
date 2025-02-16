<script setup lang='ts'>
import { useMovieStore } from '@/stores/movie';
import { storeToRefs } from 'pinia';
import UILoading from './UI/UILoading.vue';
import UIIcon from './UI/UIIcon.vue';
import UITitle from './UI/UITitle.vue';

defineProps<{
  title: string;
  items: Genre[];
  isLoading?: boolean;
}>();
const emit = defineEmits(['filter']);

const movieStore = useMovieStore();
const { filteredGenreIds } = storeToRefs(movieStore);
</script>

<template>
  <div class="hidden lg:flex sticky top-0 left-0 h-svh border-r border-gray-400 dark:border-gray-700 py-10 px-5 w-[300px]">
    <div class="flex flex-col items-center gap-y-4 w-full h-full">
      <UITitle :title="title" component="h2" class="text-center" />
      <div
        class="relative flex w-full max-h-full pb-5"
        :class="{ 'h-full': isLoading || !items.length }"
      >
        <template v-if="isLoading">
          <UILoading class="absolute inset-0 w-full h-full" />
        </template>

        <template v-else>
          <div v-if="!items.length" class="flex justify-center items-center">
            <p class="text-lg text-center dark:text-white">No filters available for the given query</p>
          </div>
          <div v-else class="w-full h-full rounded-lg shadow-xl border border-gray-400 dark:border-gray-600 overflow-hidden">
            <div class="relative flex flex-col gap-y-2 w-full h-full overflow-y-auto">
              <template
                v-for="item in items"
                :key="item.id"
              >
                <div
                  class="flex items-center justify-between w-full px-4 py-2 cursor-pointer transition-colors duration-300"
                  :class="{
                    'bg-brand-800 dark:bg-white text-white dark:text-black': filteredGenreIds.has(item.id),
                    'hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white': !filteredGenreIds.has(item.id),
                  }"
                  @click="emit('filter', item.id);"
                >
                  <span>{{ item.name }}</span>
                  <UIIcon
                    v-if="filteredGenreIds.has(item.id)"
                    name="check-circle"
                    size="24"
                    class="dark:text-black"
                  />
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
