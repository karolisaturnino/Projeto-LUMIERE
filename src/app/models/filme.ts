export interface Filme {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres?: { id: number; name: string }[];
  runtime?: number;
  production_companies?: { name: string }[];
}

export interface RespostaFilme {
  page: number;
  results: Filme[];
  total_pages: number;
  total_results: number;
}