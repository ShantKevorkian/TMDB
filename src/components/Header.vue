<script setup lang="ts">
import { useMovieStore } from '@/stores/movie';
import { debounce } from '@/helpers/helper';
import { storeToRefs } from 'pinia';
import { DEBOUCE_WAIT } from '@/helpers/constants';
import UISearchInput from './UI/UISearchInput.vue';
import UIIcon from './UI/UIIcon.vue';

const emit = defineEmits(['filter']);
const movieStore = useMovieStore();
const { searchQuery, movies, filteredMovies, page } = storeToRefs(movieStore);
const { fetchPopularMovies } = movieStore;

const handleSearchMovies = debounce((value: string) => {
  // If the search query is the same as the previous one, return
  // This is to prevent unnecessary API calls
  if (searchQuery.value === value) return;

  searchQuery.value = value;
  page.value = 1;
  if (filteredMovies.value.results.length) {
    movies.value.results = [];
    filteredMovies.value.results = [];
  } else {
    fetchPopularMovies();
  }
}, DEBOUCE_WAIT);
</script>

<template>
  <header class="header lg:ml-[150px]">
    <UISearchInput
      placeholder="Search movies..."
      class="!p-0 border-r border-brand-800 dark:border-white lg:border-none"
      @input="handleSearchMovies"
    />
    <UIIcon name="filter" button class="lg:hidden dark:text-white" @click="emit('filter')" />
  </header>
</template>

<style scoped>
.header {
  @apply fixed top-4 lg:top-6 left-6 md:left-1/2 md:-translate-x-1/2 w-[70%] sm:w-[75%] md:w-[568px] 2xl:w-[690px] h-[60px];
  @apply rounded-full shadow-sm px-4 border border-gray-300 dark:border-gray-600 z-[9999];
  @apply flex justify-between items-center gap-x-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur;
}
</style>
