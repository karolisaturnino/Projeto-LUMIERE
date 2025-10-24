import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TmdbService } from '../../services/tmdb';
import { Filme } from '../../models/filme';
import { Serie } from '../../models/serie';

interface Destaque {
  tipo: 'filme' | 'serie';
  titulo: string;
  imagem: string;
  id: number;
}

@Component({
  selector: 'app-pagina-inicial',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pagina-inicial.html',
  styleUrls: ['./pagina-inicial.css']
})
export class PaginaInicialComponent implements OnInit, OnDestroy {
  @ViewChild('carrosselFilmes') carrosselFilmes!: ElementRef;
  @ViewChild('carrosselSeries') carrosselSeries!: ElementRef;

  destaques: Destaque[] = [];
  destaqueAtual: Destaque | null = null;
  indiceDestaque = 0;
  filmesEmAlta: Filme[] = [];
  seriesEmAlta: Serie[] = [];
  carregando = true;
  paginaFilmes = 1;
  paginaSeries = 1;
  carregandoMais = false;
  private intervalo: any;

  constructor(
    private tmdbService: TmdbService,
    private router: Router
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.carregarConteudo();
  }

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  carregarConteudo(): void {
    this.tmdbService.obterFilmesEmAlta(this.paginaFilmes).subscribe({
      next: (resposta) => {
        this.filmesEmAlta = resposta.results;
        this.criarDestaques();
        this.verificarCarregamento();
      },
      error: (erro) => {
        console.error('Erro ao carregar filmes:', erro);
        this.verificarCarregamento();
      }
    });

    this.tmdbService.obterSeriesEmAlta(this.paginaSeries).subscribe({
      next: (resposta) => {
        this.seriesEmAlta = resposta.results;
        this.criarDestaques();
        this.verificarCarregamento();
      },
      error: (erro) => {
        console.error('Erro ao carregar séries:', erro);
        this.verificarCarregamento();
      }
    });
  }

  criarDestaques(): void {
    if (this.filmesEmAlta.length > 0 && this.seriesEmAlta.length > 0) {
      const filmeDestaque = this.filmesEmAlta[0];
      const serieDestaque = this.seriesEmAlta[0];

      this.destaques = [
        {
          tipo: 'filme',
          titulo: filmeDestaque.title,
          imagem: this.obterUrlImagemGrande(filmeDestaque.backdrop_path),
          id: filmeDestaque.id
        },
        {
          tipo: 'serie',
          titulo: serieDestaque.name,
          imagem: this.obterUrlImagemGrande(serieDestaque.backdrop_path),
          id: serieDestaque.id
        }
      ];

      this.destaqueAtual = this.destaques[0];
      this.iniciarCarrossel();
    }
  }

  iniciarCarrossel(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }

    this.intervalo = setInterval(() => {
      this.proximoDestaque();
    }, 8000);
  }

  proximoDestaque(): void {
    if (this.destaques.length > 0) {
      this.indiceDestaque = (this.indiceDestaque + 1) % this.destaques.length;
      this.destaqueAtual = this.destaques[this.indiceDestaque];
    }
  }

  anteriorDestaque(): void {
    if (this.destaques.length > 0) {
      this.indiceDestaque = (this.indiceDestaque - 1 + this.destaques.length) % this.destaques.length;
      this.destaqueAtual = this.destaques[this.indiceDestaque];
    }
  }

  irParaDestaque(indice: number): void {
    if (this.destaques.length > 0) {
      this.indiceDestaque = indice;
      this.destaqueAtual = this.destaques[this.indiceDestaque];
      this.iniciarCarrossel();
    }
  }

  verDetalhesDestaque(): void {
    if (this.destaqueAtual) {
      this.irParaDetalhes(this.destaqueAtual.tipo, this.destaqueAtual.id);
    }
  }

  irParaDetalhes(tipo: 'filme' | 'serie', id: number): void {
    this.router.navigate(['/detalhes', tipo, id]);
  }

  private verificarCarregamento(): void {
    if (this.filmesEmAlta.length > 0 && this.seriesEmAlta.length > 0) {
      this.carregando = false;
    }
  }

  navegarCarrossel(direcao: 'esquerda' | 'direita', tipo: 'filmes' | 'series'): void {
    const carrossel = tipo === 'filmes' ? this.carrosselFilmes : this.carrosselSeries;
    
    if (carrossel && carrossel.nativeElement) {
      const container = carrossel.nativeElement;
      const itemWidth = 200;
      const gap = 16;
      const totalWidth = itemWidth + gap;
      const visibleItems = Math.floor(container.clientWidth / totalWidth);
      const scrollAmount = visibleItems * totalWidth;
      
      if (direcao === 'esquerda') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }

  carregarMaisFilmes(): void {
    this.carregandoMais = true;
    this.paginaFilmes++;
    
    this.tmdbService.obterFilmesEmAlta(this.paginaFilmes).subscribe({
      next: (resposta) => {
        this.filmesEmAlta = [...this.filmesEmAlta, ...resposta.results];
        this.carregandoMais = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar mais filmes:', erro);
        this.carregandoMais = false;
      }
    });
  }

  carregarMaisSeries(): void {
    this.carregandoMais = true;
    this.paginaSeries++;
    
    this.tmdbService.obterSeriesEmAlta(this.paginaSeries).subscribe({
      next: (resposta) => {
        this.seriesEmAlta = [...this.seriesEmAlta, ...resposta.results];
        this.carregandoMais = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar mais séries:', erro);
        this.carregandoMais = false;
      }
    });
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