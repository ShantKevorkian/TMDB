<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMovieStore } from '@/stores/movie';
import { storeToRefs } from 'pinia';
import { useIntersectionObserver } from '@/composables/useIntersectionObserver';
import { useRouter } from 'vue-router';
import { setLocalStorage, getLocalStorage } from '@/helpers/localStorage';
import { getMoviePoster } from '@/helpers/helper';
import Header from '@/components/TheHeader.vue';
import Sidebar from '@/components/TheSidebar.vue';
import UICard from '@/components/UI/UICard.vue';
import UILoading from '@/components/UI/UILoading.vue';
import UIIcon from '@/components/UI/UIIcon.vue';
import UIVirtualList from '@/components/UI/UIVirtualList.vue';
import UIPaperMenu from '@/components/UI/UIPaperMenu.vue';
import UITitle from '@/components/UI/UITitle.vue';
import UIImage from '@/components/UI/UIImage.vue';

const router = useRouter();
const movieStore = useMovieStore();
const {
  movieGenres,
  filteredMovieGenres,
  movies,
  filteredMovies,
  isFetching,
  isGenreFetching,
  filteredGenreIds,
} = storeToRefs(movieStore);
const { fetchMovieGenres, fetchPopularMovies } = movieStore;
const imageLoaded = ref<{ [key: number]: boolean }>({});
const sentinel = ref<HTMLElement | null>(null);
const isGenreLoading = ref<boolean>(false);
// Make sure to use a Set to have O(1) complexity for add, delete, and has operations
const favorites = ref(new Set<number>(JSON.parse(getLocalStorage('favorites') || '[]')));
const isMobileFiltersOpen = ref<boolean>(false);

const handleImageLoad = (movieId: number) => {
  imageLoaded.value[movieId] = true;
};

const movieDetail = (movieId: number) => {
  router.push({ name: 'movie', params: { id: movieId } });
};

const handleFilter = (id: number) => {
  if (filteredGenreIds.value.has(id)) {
    filteredGenreIds.value.delete(id);
  } else {
    filteredGenreIds.value.add(id);
  };

  setLocalStorage('filtered_genres', JSON.stringify([...filteredGenreIds.value]));

  filteredMovies.value.results = movies.value.results.filter((movie) => {
    return [...filteredGenreIds.value].every((genreId) => movie.genre_ids.includes(genreId));
  });

  // Filter movieGenres to only include those present in movieGenreIds
  const movieGenreIds = new Set<number>();

  filteredMovies.value.results.forEach((movie) => {
    movie.genre_ids.forEach((genreId) => movieGenreIds.add(genreId));
  });

  // Filter filteredMovieGenres to only include those present in movieGenreIds
  filteredMovieGenres.value = movieGenres.value.filter((genre) => movieGenreIds.has(genre.id));
};

const toggleFavorite = (movieId: number) => {
  if (favorites.value.has(movieId)) {
    favorites.value.delete(movieId);
  } else {
    favorites.value.add(movieId);
  }

  setLocalStorage('favorites', JSON.stringify([...favorites.value]));
};

// We need movies list DOM to be scrollable always
// This solves the case when movies list is less than the screen height
const getMinHeight = () => `${window.innerHeight + 64}px`;

onMounted(async () => {
  try {
    await fetchMovieGenres();
  } catch (error) {
    console.error(error);
  } finally {
    isGenreLoading.value = false;
  }
});

useIntersectionObserver(sentinel, fetchPopularMovies);
</script>

<template>
  <div
    class="flex max-w-screen-2xl mx-auto"
    :style="{ minHeight: getMinHeight() }"
  >
    <Header @filter="isMobileFiltersOpen = true" />

    <Sidebar
      title="Filter by Genres"
      :items="filteredMovieGenres"
      :is-loading="isGenreFetching"
      @filter="handleFilter"
    />

    <UIPaperMenu
      :is-open="isMobileFiltersOpen"
      @close="isMobileFiltersOpen = false"
    >
      <template #content>
        <div class="flex flex-col items-center gap-y-4 w-full h-full px-2">
          <UITitle title="Filter by Genres" component="h5" />
          <div
            class="relative flex w-full pb-5"
            :class="{ 'h-full': isGenreFetching || !filteredMovieGenres.length }"
          >
            <template v-if="isGenreFetching">
              <UILoading class="absolute inset-0 w-full h-full" />
            </template>

            <template v-else>
              <div v-if="!filteredMovieGenres.length" class="flex justify-center items-center">
                <p class="text-lg text-center dark:text-white">No filters available for the given query</p>
              </div>
              <div v-else class="w-full h-full rounded-lg shadow-md border border-gray-300 dark:border-gray-600 overflow-hidden">
                <div class="relative flex flex-col gap-y-2 w-full h-full">
                  <template
                    v-for="genre in filteredMovieGenres"
                    :key="genre.id"
                  >
                    <div
                      class="flex items-center justify-between w-full px-4 py-2 cursor-pointer transition-colors duration-300"
                      :class="{
                        'bg-brand-800 dark:bg-white text-white dark:text-black': filteredGenreIds.has(genre.id),
                        'hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white': !filteredGenreIds.has(genre.id),
                      }"
                      @click="handleFilter(genre.id)"
                    >
                      <span>{{ genre.name }}</span>
                      <UIIcon
                        v-if="filteredGenreIds.has(genre.id)"
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
      </template>
    </UIPaperMenu>

    <section class="relative flex flex-col gap-y-6 w-full pb-10 mx-auto mt-32 px-10">
      <UITitle title="Popular Movies" component="h1" class="text-center" />
      <template v-if="!isFetching && !filteredMovies.results.length">
        <div class="w-full h-full flex items-center justify-center">
          <p
            class="text-lg lg:text-2xl text-center text-brand-800 dark:text-white"
          >
            Oops! We currently don't have any movies for the given query, try another
          </p>
        </div>
      </template>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <UIVirtualList :items="filteredMovies.results" name="Movies">
          <template #visible="{ item: movie }">
            <UICard
              :key="movie.id"
              clickable
              class="h-full"
              @click="movieDetail(movie.id)"
            >
              <div class="aspect-[2/3] relative rounded-t-[15px] overflow-hidden group">
                <template v-if="movie.poster_path">
                  <UIImage 
                    :item="movie"
                    :src="getMoviePoster(movie.poster_path)"
                    :is-loaded="imageLoaded[movie.id]"
                    rounded
                    @load-image="handleImageLoad"
                  />
                </template>

                <template v-else>
                  <UIIcon name="camera-off" size="100" class="items-center justify-center h-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-800" />
                </template>
              </div>
              
              <template #footer>
                <div class="flex flex-col gap-y-2 w-full px-3 py-2 border-t border-gray-400 dark:border-gray-600">
                  <div class="flex justify-between gap-x-2">
                    <UITitle :title="movie.title" component="h4" />
                    <UIIcon
                      name="star"
                      button
                      title="Favorite"
                      class="self-start text-transparent hover:text-yellow-300 transition-colors duration-300"
                      :class="{ 'text-yellow-300': favorites.has(movie.id) }"
                      @click="toggleFavorite(movie.id)"
                    />
                  </div>
                  <div class="flex justify-between flex-1">
                    <p class="self-end text-sm text-brand-800 dark:text-white">{{ movie.vote_average }}/10</p>
                    <p class="self-end text-sm text-gray-600 dark:text-gray-400">{{ movie.release_date }}</p>
                  </div>
                </div>
              </template>
            </UICard>
          </template>

          <template #hidden="{ item: movie }">
            <UITitle :title="movie.title" component="h4" />
          </template>
        </UIVirtualList>

      </div>
      <div
        v-if="isFetching"
        class="w-full"
        :class="{ 'h-full': !filteredMovies.results.length, 'h-32': filteredMovies.results.length }"
      >
        <UILoading />
      </div>
      <div
        ref="sentinel"
        class="absolute left-0 bottom-0 w-full"
        :class="{ 'h-full': !filteredMovies.results.length, 'h-[1px]': filteredMovies.results.length }"
      />
    </section>
  </div>
</template>
