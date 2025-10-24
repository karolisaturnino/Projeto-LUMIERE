import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TmdbService } from '../../services/tmdb';
import { Filme } from '../../models/filme';

@Component({
  selector: 'app-pagina-filmes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagina-filmes.html',
  styleUrls: ['./pagina-filmes.css']
})
export class PaginaFilmesComponent implements OnInit {
  filmes: Filme[] = [];
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
    this.carregarFilmes();
  }

  carregarFilmes(): void {
    this.tmdbService.obterFilmesPopulares(this.paginaAtual).subscribe({
      next: (resposta) => {
        this.filmes = resposta.results;
        this.totalPaginas = resposta.total_pages;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar filmes:', erro);
        this.carregando = false;
      }
    });
  }

  carregarMais(): void {
    if (this.paginaAtual >= this.totalPaginas) return;
    
    this.carregandoMais = true;
    this.paginaAtual++;
    
    this.tmdbService.obterFilmesPopulares(this.paginaAtual).subscribe({
      next: (resposta) => {
        this.filmes = [...this.filmes, ...resposta.results];
        this.carregandoMais = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar mais filmes:', erro);
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
}