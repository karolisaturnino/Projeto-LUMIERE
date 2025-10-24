import { Routes } from '@angular/router';
import { PaginaInicialComponent } from './components/pagina-inicial/pagina-inicial';
import { PaginaFilmesComponent } from './components/pagina-filmes/pagina-filmes';
import { PaginaSeriesComponent } from './components/pagina-series/pagina-series';
import { PaginaBuscaComponent } from './components/pagina-busca/pagina-busca';
import { PaginaDetalhesComponent } from './components/pagina-detalhes/pagina-detalhes';

export const routes: Routes = [
  { path: '', component: PaginaInicialComponent },
  { path: 'filmes', component: PaginaFilmesComponent },
  { path: 'series', component: PaginaSeriesComponent },
  { path: 'busca', component: PaginaBuscaComponent },
  { path: 'detalhes/:tipo/:id', component: PaginaDetalhesComponent },
  { path: '**', redirectTo: '' }
];