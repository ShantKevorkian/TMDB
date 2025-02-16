declare global {
  type Genre = {
    id: number;
    name: string;
  }
  
  type Movie = {
    id: number;
    title: string;
    original_title: string;
    genre_ids: number[];
    overview: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
  }
  
  type Movies = {
    results: Movie[];
    total_pages: number;
  }
  
  type Detail = {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    genres: Genre[];
    runtime: number;
    backdrop_path: string;
    revenue: number;
    budget: number;
    production_companies: any[];
    spoken_languages: any[];
  }
  
  type Cast = {
    id: number;
    name: string;
    character: string;
    profile_path: string;
  }
  
  type Trailer = {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
  }
  
  type IndividualMovie = {
    detail: Detail;
    cast: Cast[];
    trailers: Trailer[];
  }
}

export {};
