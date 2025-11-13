import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbService } from '../../services/tmdb';
import { Filme } from '../../models/filme';
import { Serie } from '../../models/serie';

@Component({
  selector: 'app-pagina-busca',
  standalone: true,
  imports: [],
  templateUrl: './pagina-busca.html',
  styleUrls: ['./pagina-busca.css']
})
export class PaginaBuscaComponent implements OnInit {
  filmes: Filme[] = [];
  series: Serie[] = [];
  carregando = true;
  carregandoMais = false;
  termo: string = '';
  semResultados = false;
  abaAtiva: 'filmes' | 'series' = 'filmes';
  paginaAtual: number = 1;
  totalPaginas: number = 1;
  temMaisResultados: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tmdbService: TmdbService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.termo = params['q'] || '';
      if (this.termo) {
        this.resetarBusca();
        this.buscar();
      } else {
        this.carregando = false;
      }
    });
  }

  resetarBusca(): void {
    this.filmes = [];
    this.series = [];
    this.paginaAtual = 1;
    this.totalPaginas = 1;
    this.temMaisResultados = true;
    this.carregando = true;
    this.semResultados = false;
  }

  mudarAba(aba: 'filmes' | 'series'): void {
    this.abaAtiva = aba;
  }

  buscar(): void {
    this.carregando = true;

    this.tmdbService.buscarFilmes(this.termo, 1).subscribe({
      next: (resposta) => {
        this.filmes = resposta.results;
        this.totalPaginas = resposta.total_pages;
        this.verificarResultados();
      },
      error: (erro) => {
        console.error('Erro ao buscar filmes:', erro);
        this.verificarResultados();
      }
    });

    this.tmdbService.buscarSeries(this.termo, 1).subscribe({
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

  carregarMais(): void {
    if (this.carregandoMais || !this.temMaisResultados) return;

    this.carregandoMais = true;
    this.paginaAtual++;

    if (this.abaAtiva === 'filmes') {
      this.tmdbService.buscarFilmes(this.termo, this.paginaAtual).subscribe({
        next: (resposta) => {
          this.filmes = [...this.filmes, ...resposta.results];
          this.totalPaginas = resposta.total_pages;
          this.temMaisResultados = this.paginaAtual < this.totalPaginas;
          this.carregandoMais = false;
        },
        error: (erro) => {
          console.error('Erro ao carregar mais filmes:', erro);
          this.carregandoMais = false;
        }
      });
    } else {
      this.tmdbService.buscarSeries(this.termo, this.paginaAtual).subscribe({
        next: (resposta) => {
          this.series = [...this.series, ...resposta.results];
          this.totalPaginas = resposta.total_pages;
          this.temMaisResultados = this.paginaAtual < this.totalPaginas;
          this.carregandoMais = false;
        },
        error: (erro) => {
          console.error('Erro ao carregar mais séries:', erro);
          this.carregandoMais = false;
        }
      });
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.carregandoMais || !this.temMaisResultados) return;

    const scrollPosition = window.pageYOffset;
    const windowSize = window.innerHeight;
    const bodyHeight = document.body.offsetHeight;

    if (scrollPosition + windowSize >= bodyHeight - 200) {
      this.carregarMais();
    }
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