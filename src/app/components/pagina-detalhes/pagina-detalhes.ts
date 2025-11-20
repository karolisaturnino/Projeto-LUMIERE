import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbService } from '../../services/tmdb';
import { Filme } from '../../models/filme';
import { Serie } from '../../models/serie';
import { MinhaListaService } from '../../services/minha-lista.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagina-detalhes',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './pagina-detalhes.html',
  styleUrls: ['./pagina-detalhes.css']
})
export class PaginaDetalhesComponent implements OnInit {
  item: Filme | Serie | null = null;
  carregando = true;
  tipo: 'filme' | 'serie' = 'filme';
  novoComentario: string = "";
  estrelasArray = [1,2,3,4,5,6,7,8,9,10];
  novaNota = 0;
  comentarios: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tmdbService: TmdbService,
    private minhaLista: MinhaListaService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    
    this.route.params.subscribe(params => {
      this.tipo = params['tipo'] as 'filme' | 'serie';
      const id = +params['id'];
      this.carregarDetalhes(id);
    });
  }

  adicionarNaLista() {
    if (!this.item) return;

    this.minhaLista.adicionar({
      id: this.item.id,
      titulo: this.eFilme(this.item) ? this.item.title : this.item.name,
      poster: 'https://image.tmdb.org/t/p/w500' + this.item.poster_path,
      tipo: this.eFilme(this.item) ? 'filme' : 'serie'
    });

    alert("Adicionado à sua lista!");
  }

  carregarDetalhes(id: number): void {
    this.carregando = true;

    const callback = (item: any) => {
      this.item = item;
      this.carregando = false;
      this.carregarComentarios();
    };

    if (this.tipo === 'filme') {
      this.tmdbService.obterDetalhesFilme(id).subscribe({
        next: callback,
        error: (erro) => {
          console.error('Erro ao carregar filme:', erro);
          this.carregando = false;
        }
      });
    } else {
      this.tmdbService.obterDetalhesSerie(id).subscribe({
        next: callback,
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

  carregarComentarios() {
    if (!this.item) return;

    const salvo = localStorage.getItem("comentarios_" + this.item.id);
    this.comentarios = salvo ? JSON.parse(salvo) : [];
  }

  salvarComentarios() {
    if (!this.item) return;

    localStorage.setItem("comentarios_" + this.item.id, JSON.stringify(this.comentarios));
  }

  adicionarComentario() {
    if (!this.novoComentario.trim()) return;

    const novo = {
      texto: this.novoComentario,
      nota: this.novaNota,
      data: new Date().toLocaleString()
    };

    this.comentarios.push(novo);
    this.salvarComentarios();

    this.novoComentario = "";
    this.novaNota = 0;
  }

  selecionarNota(nota: number) {
    this.novaNota = nota;
  }
}