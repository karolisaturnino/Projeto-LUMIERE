export interface Serie {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genres?: { id: number; name: string }[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  production_companies?: { name: string }[];
}

export interface RespostaSerie {
  page: number;
  results: Serie[];
  total_pages: number;
  total_results: number;
}