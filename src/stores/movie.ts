import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { getLocalStorage, setLocalStorage } from '@/helpers/localStorage';
import { HEADERS } from '@/helpers/constants';
import axios from 'axios';

export const useMovieStore = defineStore('movie', () => {
  const movieGenres = ref<Genre[]>(JSON.parse(getLocalStorage('movie_genres') || '[]'));
  const filteredMovieGenres = ref<Genre[]>(movieGenres.value);
  const movies = reactive<Movies>(JSON.parse(getLocalStorage('movies') || '{"results": [], "total_pages": 1}'));
  // We can't initialize filteredMovies with movies because it will be a reference
  // And we want to keep movies as the original list
  const filteredMovies = reactive<Movies>(JSON.parse(getLocalStorage('movies') || '{"results": [], "total_pages": 1}'));
  const individualMovie = reactive<IndividualMovie>({
    detail: {} as Detail,
    cast: [],
    trailers: [],
  });
  const page = ref<number>(parseInt(getLocalStorage('page') || '1', 10));
  const searchQuery = ref<string>(getLocalStorage('search') || '');
  const filteredGenreIds = ref(new Set<number>(JSON.parse(getLocalStorage('filtered_genres') || '[]')));
  const isFetching = ref<boolean>(false);
  const isGenreFetching = ref<boolean>(false);

  const fetchMovieGenres = async () => {
    // Check if we have the movie detail in local storage
    // If we do, we don't need to fetch it again
    if (movieGenres.value.length) return;

    isGenreFetching.value = true;

    try {
      const response = await axios.get(`${import.meta.env.VITE_TMDB_API_BASE_URL}/genre/movie/list`, {
        headers: HEADERS,
      });
  
      movieGenres.value = response.data.genres;
      filteredMovieGenres.value = movieGenres.value

      // Save the movieGenres to local storage
      setLocalStorage('movie_genres', JSON.stringify(movieGenres.value));
    } catch(error) {
      throw error;
    } finally {
      isGenreFetching.value = false;
    }
  };

  const fetchPopularMovies = async () => {
    // Prevent fetching if we are already fetching
    if (isFetching.value) return;
    isFetching.value = true;
    
    // If we have a search query, we need to fetch movies by title
    if (searchQuery.value) {
      fetchMoviesByTitle();
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_TMDB_API_BASE_URL}/movie/popular`, {
        headers: HEADERS,
        params: { page: page.value },
      });

      movies.results.push(...response.data.results);
      // TMDB api somtimes gets us duplicate movies, we need to make them unique
      // So our list virtualization works correctly
      movies.results = [...new Map(movies.results.map((item) => [item.id, item])).values()];
      filteredMovies.results = movies.results;

      // Filter movieGenres to only include those present in movieGenreIds
      const movieGenreIds = new Set<number>();

      filteredMovies.results.forEach((movie) => {
        movie.genre_ids.forEach((genreId) => movieGenreIds.add(genreId));
      });

      // Filter filteredMovieGenres to only include those present in movieGenreIds
      filteredMovieGenres.value = movieGenres.value.filter((genre) => movieGenreIds.has(genre.id));  

      filteredMovies.results = filteredMovies.results.filter((movie) => {
        return [...filteredGenreIds.value].every((genreId) => movie.genre_ids.includes(genreId));
      });

      movies.total_pages = response.data.total_pages;
      filteredMovies.total_pages = response.data.total_pages;
      page.value++;

      // Save the movies to local storage
      setLocalStorage('movies', JSON.stringify(filteredMovies));
      setLocalStorage('page', JSON.stringify(page.value));
    } catch(error) {
      console.error(error);
    } finally {
      isFetching.value = false;
    }
  };

  const fetchMovieDetail = async (id: number) => {
    // Check if we have the movie detail in local storage with the same id
    // If we do, we don't need to fetch it again
    const localMovieDetail = JSON.parse(getLocalStorage('movie_detail') || '{}');
    if (Object.keys(localMovieDetail).length && localMovieDetail.id === id) {
      individualMovie.detail = localMovieDetail;
      return;
    }

    isFetching.value = true;

    try {
      const response = await axios.get(`${import.meta.env.VITE_TMDB_API_BASE_URL}/movie/${id}`, {
        headers: HEADERS,
      })
  
      individualMovie.detail = response.data;

      // Save the individualMovie.detail to local storage
      setLocalStorage('movie_detail', JSON.stringify(individualMovie.detail));
    } catch(error) {
      throw error;
    }

    // Run this only when no error occurs
    // If there is an error, it will redirect to the error page
    isFetching.value = false;
  };

  const fetchMoviesByTitle = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_TMDB_API_BASE_URL}/search/movie`, {
        headers: HEADERS,
        params: {
          query: searchQuery.value,
          page: page.value,
        },
      })
  
      filteredMovies.results.push(...response.data.results);
      // TMDB api somtimes gets us duplicate movies, we need to make them unique
      // So our list virtualization works correctly
      filteredMovies.results = [...new Map(filteredMovies.results.map((item) => [item.id, item])).values()];
      movies.results = filteredMovies.results;

      const movieGenreIds = new Set<number>();

      filteredMovies.results.forEach((movie) => {
        movie.genre_ids.forEach((genreId) => movieGenreIds.add(genreId));
      });
      
      // Filter filteredMovieGenres to only include those present in movieGenreIds
      filteredMovieGenres.value = movieGenres.value.filter((genre) => movieGenreIds.has(genre.id));   
      
      // Remove from filteredGenreIds those genres that are not present in the current search results
      filteredGenreIds.value = new Set([...filteredGenreIds.value].filter((genreId) => movieGenreIds.has(genreId)));
      // Also remove from local storage
      setLocalStorage('filtered_genres', JSON.stringify([...filteredGenreIds.value]));

      filteredMovies.results = filteredMovies.results.filter((movie) => {
        return [...filteredGenreIds.value].every((genreId) => movie.genre_ids.includes(genreId));
      });

      filteredMovies.total_pages = response.data.total_pages;
      page.value++;

      // Save the movies to local storage
      setLocalStorage('movies', JSON.stringify(filteredMovies));
      setLocalStorage('page', JSON.stringify(page.value));
    } catch(error) {
      console.error(error);
    } finally {
      isFetching.value = false;
    }
  };

  const fetchMovieTrailers = async (id: number) => {
    // Check if we have the movie trailers in local storage with the same id
    // If we do, we don't need to fetch it again
    const localMovieTrailers = JSON.parse(getLocalStorage('movie_trailers') || '[]');
    const localMovieId = parseInt(getLocalStorage('movie_id') || '0', 10);
    if (localMovieId === id && localMovieTrailers.length) {
      individualMovie.trailers = localMovieTrailers;
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_TMDB_API_BASE_URL}/movie/${id}/videos`, {
        headers: HEADERS,
      })
  
      // We need to filter the results to get only the trailers by checking the type
      // And site for YouTube
      individualMovie.trailers = response.data.results.filter((video: any) => 
        video.type === 'Trailer' && video.site === 'YouTube');

      // Save the individualMovie.trailers to local storage
      setLocalStorage('movie_trailers', JSON.stringify(individualMovie.trailers));
    } catch(error) {
      throw error;
    }
  };

  const fetchMovieCast = async (id: number) => {
    // Check if we have the movie cast in local storage with the same id
    // If we do, we don't need to fetch it again
    const localMovieCast = JSON.parse(getLocalStorage('movie_cast') || '[]');
    const localMovieId = parseInt(getLocalStorage('movie_id') || '0', 10);
    if (localMovieId === id && localMovieCast.length) {
      individualMovie.cast = localMovieCast;
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_TMDB_API_BASE_URL}/movie/${id}/credits`, {
        headers: HEADERS,
      })
  
      individualMovie.cast = response.data.cast

      // Save the individualMovie.cast to local storage
      setLocalStorage('movie_cast', JSON.stringify(individualMovie.cast));
    } catch(error) {
      throw error;
    }
  };

  return {
    movieGenres,
    filteredMovieGenres,
    movies,
    filteredMovies,
    individualMovie,
    isFetching,
    isGenreFetching,
    searchQuery,
    page,
    filteredGenreIds,
    fetchMovieGenres,
    fetchPopularMovies,
    fetchMovieDetail,
    fetchMoviesByTitle,
    fetchMovieTrailers,
    fetchMovieCast,
  };
});
