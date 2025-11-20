import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TmdbService } from '../../services/tmdb';
import { Filme } from '../../models/filme';
import { MinhaListaService } from '../../services/minha-lista.service';

interface Destaque {
  tipo: 'filme';
  titulo: string;
  imagem: string;
  id: number;
}

@Component({
  selector: 'app-pagina-filmes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagina-filmes.html',
  styleUrls: ['./pagina-filmes.css']
})
export class PaginaFilmesComponent implements OnInit, OnDestroy {
  destaques: Destaque[] = [];
  destaqueAtual: Destaque | null = null;
  indiceDestaque = 0;
  filmes: Filme[] = [];
  carregando = true;
  carregandoMais = false;
  paginaAtual = 1;
  totalPaginas = 1;
  private intervalo: any;

  constructor(
    private tmdbService: TmdbService,
    private router: Router,
    private listaService: MinhaListaService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.carregarFilmes();
  }

  ngOnDestroy(): void {
    if (this.intervalo) clearInterval(this.intervalo);
  }

  carregarFilmes(): void {
    this.tmdbService.obterFilmesPopulares(this.paginaAtual).subscribe({
      next: (resposta) => {
        this.filmes = resposta.results;
        this.criarDestaques();
        this.totalPaginas = resposta.total_pages;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar filmes:', erro);
        this.carregando = false;
      }
    });
  }

  criarDestaques(): void {
    if (this.filmes.length > 0) {
      this.destaques = this.filmes.slice(0, 5).map(filme => ({
        tipo: 'filme',
        titulo: filme.title,
        imagem: this.obterUrlImagemGrande(filme.backdrop_path),
        id: filme.id
      }));

      this.destaqueAtual = this.destaques[0];
      this.iniciarCarrossel();
    }
  }

  iniciarCarrossel(): void {
    if (this.intervalo) clearInterval(this.intervalo);

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

  adicionarDestaqueNaLista(): void {
    if (this.destaqueAtual) {
      const filmeDestaque = this.filmes.find(f => f.id === this.destaqueAtual?.id);
      if (filmeDestaque) {
        this.listaService.adicionar({
          id: filmeDestaque.id,
          titulo: filmeDestaque.title,
          poster: this.obterUrlImagem(filmeDestaque.poster_path),
          tipo: 'filme'
        });
        alert("Filme adicionado à sua lista!");
      }
    }
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

  obterUrlImagemGrande(caminho: string): string {
    if (!caminho) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxMjgwIDcyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik01MDAgMzI1TDU3NSAyNTBMNjUwIDMyNUg1MDBaIiBmaWxsPSIjNjY2Ii8+Cjx0ZXh0IHg9IjY0MCIgeT0iNDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiPk5lbmh1bWEgSW1hZ2VtPC90ZXh0Pgo8L3N2Zz4K';
    }
    return `https://image.tmdb.org/t/p/w1280${caminho}`;
  }
}