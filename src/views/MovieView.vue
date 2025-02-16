<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMovieStore } from '@/stores/movie';
import { storeToRefs } from 'pinia';
import { getMoviePoster } from '@/helpers/helper';
import { setLocalStorage } from '@/helpers/localStorage';
import { PROFILE_IMAGE_SIZE } from '@/helpers/constants';
import UILoading from '@/components/UI/UILoading.vue';
import UICard from '@/components/UI/UICard.vue';
import UIIcon from '@/components/UI/UIIcon.vue';
import UITitle from '@/components/UI/UITitle.vue';
import UIImage from '@/components/UI/UIImage.vue';
import LiteYouTubeEmbed from 'vue-lite-youtube-embed';
import 'vue-lite-youtube-embed/style.css';

import UICarousel from '@/components/UI/UICarousel.vue';

const route = useRoute();
const router = useRouter();
const movieId = parseInt(route.params.id as string, 10);
const movieStore = useMovieStore();
const { individualMovie, isFetching } = storeToRefs(movieStore);
const { fetchMovieDetail, fetchMovieCast, fetchMovieTrailers } = movieStore;
const isLoading = ref<boolean>(false);
const isPosterLoaded = ref<boolean>(false);
const imageLoaded = ref<{ [key: number]: boolean }>({});

const handleImageLoad = (movieId: number) => {
  imageLoaded.value[movieId] = true;
};

onMounted(async () => {
  try {
    // fetchMovieDetail is called first to get the movie details
    await fetchMovieDetail(movieId);
    // Promise.allSettled is used to make sure that both fetchMovieCast and fetchMovieTrailers are resolved
    isLoading.value = true;
    await Promise.allSettled([fetchMovieCast(movieId), fetchMovieTrailers(movieId)]);

    // Set the movie_id in localStorage to check if the user has visited this movie before
    setLocalStorage('movie_id', movieId.toString());
  } catch (error) {
    console.error(error);
    router.push({ name: 'error' });
  } finally {
    isLoading.value = false;
  }
})
</script>

<template>
  <div class="flex flex-col gap-y-6 w-full h-full mb-10">
    <template v-if="isFetching">
      <div class="absolute inset-0 flex items-center justify-center min-h-svh">
        <UILoading />
      </div>
    </template>

    <template v-else>
      <div class="relative w-full h-[60svh]">
        <UIImage 
          :item="individualMovie.detail"
          :src="getMoviePoster(individualMovie.detail.backdrop_path ?? individualMovie.detail.poster_path, 'original')"
          :is-loaded="isPosterLoaded"
          cover
          @load-image="isPosterLoaded = true"
        />
      </div>
      
      <section class="max-w-[85%] 2xl:max-w-7xl mx-auto flex flex-col gap-y-6">
        <template v-if="Object.keys(individualMovie.detail).length">
          <UITitle :title="individualMovie.detail.title" component="h1" class="text-center" />
          <UICard>
            <template #header>
              <UITitle title="Overview" component="h2" class="px-4 pt-2" />
            </template>
            <div class="flex flex-col gap-y-4 px-4 py-2 dark:text-white">
              <p>
                {{ individualMovie.detail.overview }}
              </p>
              <p>
                They had a budget of {{ individualMovie.detail.budget }} USD and made a revenue of {{ individualMovie.detail.revenue }} USD.
              </p>
              <p>
                The movie was released on {{ individualMovie.detail.release_date }} and has a runtime of {{ individualMovie.detail.runtime }} minutes.
              </p>
              <p>
                The movie was produced by {{ individualMovie.detail.production_companies.map(company => company.name).join(', ') }}.
              </p>
              <p>
                The movie's spoken languages are {{ individualMovie.detail.spoken_languages.map(language => language.english_name).join(', ') }}.
              </p>
            </div>
          </UICard>
        </template>

        <div class="flex flex-col gap-y-2">
          <UITitle title="Cast" component="h3" />
          <div class="border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl overflow-hidden">
            <div v-if="isLoading" class="h-40">
              <UILoading />
            </div>
            <div v-else class="w-full flex items-center gap-x-4 overflow-x-auto p-4">
              <UICard v-for="cast in individualMovie.cast" :key="cast.id" class="flex-shrink-0 h-full">
                <div class="h-[278px] w-[185px] relative rounded-t-[15px] overflow-hidden group">
                  <template v-if="cast.profile_path">
                    <UIImage 
                      :item="cast"
                      :src="getMoviePoster(cast.profile_path, PROFILE_IMAGE_SIZE)"
                      :is-loaded="imageLoaded[cast.id]"
                      rounded
                      @load-image="handleImageLoad"
                    />
                  </template>

                  <template v-else>
                    <UIIcon name="profile" size="100" class="items-center justify-center h-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-800" />
                  </template>
                </div>

                <template #footer>
                  <div class="flex flex-col gap-y-2 w-full max-w-[185px] px-3 py-2 border-t border-gray-400 dark:border-gray-600">
                    <UITitle :title="cast.name" component="h4" class="truncate" />
                    <UITitle :title="cast.character" component="h6" class="truncate" />
                  </div>
                </template>
              </UICard>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-y-2">
          <UITitle title="Trailers to Watch" component="h3" class="lg:text-2xl" />
          <template v-if="!individualMovie.trailers.length">
            <div class="flex items-center justify-center h-40">
              <p
                class="text-lg lg:text-2xl text-center text-brand-800 dark:text-white"
              >
                No trailers available for this movie
              </p>
            </div>
          </template>

          <UICarousel v-else :items="individualMovie.trailers">
            <template #default="{ item: trailer }">
              <LiteYouTubeEmbed
                :id="trailer.key"
                :title="trailer.name"
              />
            </template>
          </UICarousel>
        </div>
      </section>
    </template>
  </div>
</template>
