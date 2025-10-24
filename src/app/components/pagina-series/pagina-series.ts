import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TmdbService } from '../../services/tmdb';
import { Serie } from '../../models/serie';

@Component({
  selector: 'app-pagina-series',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagina-series.html',
  styleUrls: ['./pagina-series.css']
})
export class PaginaSeriesComponent implements OnInit {
  seriesDestaque: Serie[] = [];
  series: Serie[] = [];
  carregando = true;
  carregandoMais = false;
  paginaAtual = 1;
  totalPaginas = 1;

  constructor(
    private tmdbService: TmdbService,
    private router: Router
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.carregarSeries();
  }

  carregarSeries(): void {
    this.tmdbService.obterSeriesPopulares(this.paginaAtual).subscribe({
      next: (resposta) => {
        this.series = resposta.results;
        this.seriesDestaque = resposta.results.slice(0, 2);
        this.totalPaginas = resposta.total_pages;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar séries:', erro);
        this.carregando = false;
      }
    });
  }

  carregarMais(): void {
    if (this.paginaAtual >= this.totalPaginas) return;
    
    this.carregandoMais = true;
    this.paginaAtual++;
    
    this.tmdbService.obterSeriesPopulares(this.paginaAtual).subscribe({
      next: (resposta) => {
        this.series = [...this.series, ...resposta.results];
        this.carregandoMais = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar mais séries:', erro);
        this.carregandoMais = false;
      }
    });
  }

  irParaDetalhes(tipo: 'filme' | 'serie', id: number): void {
    this.router.navigate(['/detalhes', tipo, id]);
  }

  obterUrlImagem(caminho: string): string {
    if (!caminho) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgdmlld0JveD0iMCAwIDUwMCA3NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik0yMDAgMzI1TDI3NSAyNTBMMzUwIDMyNUgyMDBaIiBmaWxsPSIjNjY2Ii8+Cjx0ZXh0IHg9IjI1MCIgeT0iNDUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPk5lbmh1bWEgSW1hZ2VtPC90ZXh0Pgo8L3N2Zz4K';
    }
    return `https://image.tmdb.org/t/p/w500${caminho}`;
  }

  obterUrlImagemGrande(caminho: string): string {
    if (!caminho) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxMjgwIDcyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik01MDAgMzI1TDU3NSAyNTBMNjUwIDMyNUg1MDBaIiBmaWxsPSIjNjY2Ii8+Cjx0ZXh0IHg9IjY0MCIgeT0iNDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiPk5lbmh1bWEgSW1hZ2VtPC90ZXh0Pgo8L3N2Zz4K';
    }
    return `https://image.tmdb.org/t/p/w1280${caminho}`;
  }
}