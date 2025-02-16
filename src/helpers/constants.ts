const DEBOUCE_WAIT = 600;
const MOVIE_POSTER_SIZE = 'w500';
const PROFILE_IMAGE_SIZE = 'w185';
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
};

export {
  DEBOUCE_WAIT,
  MOVIE_POSTER_SIZE,
  PROFILE_IMAGE_SIZE,
  HEADERS
};
