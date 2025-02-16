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

  type ProductionCompany = {
    id: number;
    name: string;
    logo_path: string;
    origin_country: string;
  }

  type SpokenLanguage = {
    english_name: string;
    iso_639_1: string;
    name: string;
  }

  type Video = {
    site: string;
    type: string;
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
    production_companies: ProductionCompany[];
    spoken_languages: SpokenLanguage[];
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
