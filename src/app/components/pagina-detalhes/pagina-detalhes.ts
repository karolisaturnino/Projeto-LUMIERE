import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbService } from '../../services/tmdb';
import { Filme } from '../../models/filme';
import { Serie } from '../../models/serie';

@Component({
  selector: 'app-pagina-detalhes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagina-detalhes.html',
  styleUrls: ['./pagina-detalhes.css']
})
export class PaginaDetalhesComponent implements OnInit {
  item: Filme | Serie | null = null;
  carregando = true;
  tipo: 'filme' | 'serie' = 'filme';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tmdbService: TmdbService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.route.params.subscribe(params => {
      this.tipo = params['tipo'] as 'filme' | 'serie';
      const id = +params['id'];
      this.carregarDetalhes(id);
    });
  }

  carregarDetalhes(id: number): void {
    this.carregando = true;

    if (this.tipo === 'filme') {
      this.tmdbService.obterDetalhesFilme(id).subscribe({
        next: (filme) => {
          this.item = filme;
          this.carregando = false;
        },
        error: (erro) => {
          console.error('Erro ao carregar filme:', erro);
          this.carregando = false;
        }
      });
    } else {
      this.tmdbService.obterDetalhesSerie(id).subscribe({
        next: (serie) => {
          this.item = serie;
          this.carregando = false;
        },
        error: (erro) => {
          console.error('Erro ao carregar série:', erro);
          this.carregando = false;
        }
      });
    }
  }

  voltar(): void {
    this.router.navigate(['/']);
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

  eFilme(item: any): item is Filme {
    return this.tipo === 'filme';
  }

  eSerie(item: any): item is Serie {
    return this.tipo === 'serie';
  }
}