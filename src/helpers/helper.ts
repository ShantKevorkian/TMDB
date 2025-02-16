import { MOVIE_POSTER_SIZE } from "./constants";

const getMoviePoster = (path: string, posterSize: string = MOVIE_POSTER_SIZE) => 
  `${import.meta.env.VITE_TMDB_IMAGE_BASE_URL}/${posterSize}${path}`;

const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export { getMoviePoster, debounce };
