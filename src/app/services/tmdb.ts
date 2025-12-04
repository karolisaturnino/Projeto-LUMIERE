import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filme, RespostaFilme } from '../models/filme';
import { Serie, RespostaSerie } from '../models/serie';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private chaveApi = '7cf87629eebb08e4ceeaf801f3e3cd18';
  private urlBase = 'https://api.themoviedb.org/3';
  private idioma = 'pt-BR';

  constructor(private http: HttpClient) { }

  definirIdioma(idioma: string) {
    this.idioma = idioma;
  }

  obterFilmesPopulares(pagina: number = 1): Observable<RespostaFilme> {
    const parametros = new HttpParams()
      .set('api_key', this.chaveApi)
      .set('page', pagina.toString())
      .set('language', this.idioma);
    return this.http.get<RespostaFilme>(`${this.urlBase}/movie/popular`, { params: parametros });
  }

  obterFilmesEmAlta(pagina: number = 1): Observable<RespostaFilme> {
    const parametros = new HttpParams()
      .set('api_key', this.chaveApi)
      .set('page', pagina.toString())
      .set('language', this.idioma);
    return this.http.get<RespostaFilme>(`${this.urlBase}/trending/movie/week`, { params: parametros });
  }

  obterSeriesPopulares(pagina: number = 1): Observable<RespostaSerie> {
    const parametros = new HttpParams()
      .set('api_key', this.chaveApi)
      .set('page', pagina.toString())
      .set('language', this.idioma);
    return this.http.get<RespostaSerie>(`${this.urlBase}/tv/popular`, { params: parametros });
  }

  obterSeriesEmAlta(pagina: number = 1): Observable<RespostaSerie> {
    const parametros = new HttpParams()
      .set('api_key', this.chaveApi)
      .set('page', pagina.toString())
      .set('language', this.idioma);
    return this.http.get<RespostaSerie>(`${this.urlBase}/trending/tv/week`, { params: parametros });
  }

  buscarFilmes(query: string, pagina: number = 1): Observable<RespostaFilme> {
    const parametros = new HttpParams()
      .set('api_key', this.chaveApi)
      .set('query', query)
      .set('page', pagina.toString())
      .set('language', this.idioma);
    return this.http.get<RespostaFilme>(`${this.urlBase}/search/movie`, { params: parametros });
  }

  buscarSeries(query: string, pagina: number = 1): Observable<RespostaSerie> {
    const parametros = new HttpParams()
      .set('api_key', this.chaveApi)
      .set('query', query)
      .set('page', pagina.toString())
      .set('language', this.idioma);
    return this.http.get<RespostaSerie>(`${this.urlBase}/search/tv`, { params: parametros });
  }

  obterDetalhesFilme(id: number): Observable<Filme> {
    const parametros = new HttpParams()
      .set('api_key', this.chaveApi)
      .set('language', this.idioma);
    return this.http.get<Filme>(`${this.urlBase}/movie/${id}`, { params: parametros });
  }

  obterDetalhesSerie(id: number): Observable<Serie> {
    const parametros = new HttpParams()
      .set('api_key', this.chaveApi)
      .set('language', this.idioma);
    return this.http.get<Serie>(`${this.urlBase}/tv/${id}`, { params: parametros });
  }

 
  obterDetalhesFilmeCompleto(id: number): Observable<Filme> {
    const parametros = new HttpParams()
      .set('api_key', this.chaveApi)
      .set('language', this.idioma)
      .set('append_to_response', 'translations');
    return this.http.get<Filme>(`${this.urlBase}/movie/${id}`, { params: parametros });
  }

  obterDetalhesSerieCompleto(id: number): Observable<Serie> {
    const parametros = new HttpParams()
      .set('api_key', this.chaveApi)
      .set('language', this.idioma)
      .set('append_to_response', 'translations');
    return this.http.get<Serie>(`${this.urlBase}/tv/${id}`, { params: parametros });
  }
}
