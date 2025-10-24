import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbService } from '../../services/tmdb';
import { Filme } from '../../models/filme';
import { Serie } from '../../models/serie';

@Component({
  selector: 'app-pagina-busca',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagina-busca.html',
  styleUrls: ['./pagina-busca.css']
})
export class PaginaBuscaComponent implements OnInit {
  filmes: Filme[] = [];
  series: Serie[] = [];
  carregando = true;
  termo: string = '';
  semResultados = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tmdbService: TmdbService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.termo = params['q'] || '';
      if (this.termo) {
        this.buscar();
      } else {
        this.carregando = false;
      }
    });
  }

  buscar(): void {
    this.carregando = true;
    this.semResultados = false;

    this.tmdbService.buscarFilmes(this.termo).subscribe({
      next: (resposta) => {
        this.filmes = resposta.results;
        this.verificarResultados();
      },
      error: (erro) => {
        console.error('Erro ao buscar filmes:', erro);
        this.verificarResultados();
      }
    });

    this.tmdbService.buscarSeries(this.termo).subscribe({
      next: (resposta) => {
        this.series = resposta.results;
        this.verificarResultados();
      },
      error: (erro) => {
        console.error('Erro ao buscar séries:', erro);
        this.verificarResultados();
      }
    });
  }

  irParaDetalhes(tipo: 'filme' | 'serie', id: number): void {
    this.router.navigate(['/detalhes', tipo, id]);
  }

  private verificarResultados(): void {
    this.carregando = false;
    this.semResultados = this.filmes.length === 0 && this.series.length === 0;
  }

  obterUrlImagem(caminho: string): string {
    if (!caminho) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgdmlld0JveD0iMCAwIDUwMCA3NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik0yMDAgMzI1TDI3NSAyNTBMMzUwIDMyNUgyMDBaIiBmaWxsPSIjNjY2Ii8+Cjx0ZXh0IHg9IjI1MCIgeT0iNDUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPk5lbmh1bWEgSW1hZ2VtPC90ZXh0Pgo8L3N2Zz4K';
    }
    return `https://image.tmdb.org/t/p/w500${caminho}`;
  }
}