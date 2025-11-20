import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MinhaListaService } from '../services/minha-lista.service';

@Component({
  selector: 'app-pagina-minha-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pagina-minha-lista.html',
  styleUrls: ['./pagina-minha-lista.css']
})
export class PaginaMinhaListaComponent {
  lista: any[] = [];
  listaFiltrada: any[] = [];
  filtroAtivo: string = 'todos';

  constructor(
    private minhaListaService: MinhaListaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarLista();
  }

  carregarLista() {
    this.lista = this.minhaListaService.obterLista();
    this.aplicarFiltro();
  }

  mudarFiltro(filtro: string) {
    this.filtroAtivo = filtro;
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    switch (this.filtroAtivo) {
      case 'filmes':
        this.listaFiltrada = this.lista.filter(item => item.tipo === 'filme');
        break;
      case 'series':
        this.listaFiltrada = this.lista.filter(item => item.tipo === 'serie');
        break;
      default:
        this.listaFiltrada = this.lista;
    }
  }

  removerDaLista(id: number) {
    this.minhaListaService.remover(id);
    this.carregarLista();
  }

  getFilmesCount(): number {
    return this.lista.filter(item => item.tipo === 'filme').length;
  }

  getSeriesCount(): number {
    return this.lista.filter(item => item.tipo === 'serie').length;
  }

  verDetalhes(item: any) {
    this.router.navigate(['/detalhes', item.tipo, item.id]);
  }

  handleImageError(event: any) {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgdmlld0JveD0iMCAwIDUwMCA3NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik0yMDAgMzI1TDI3NSAyNTBMMzUwIDMyNUgyMDBaIiBmaWxsPSIjNjY2Ii8+Cjx0ZXh0IHg9IjI1MCIgeT0iNDUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPk5lbmh1bWEgSW1hZ2VtPC90ZXh0Pgo8L3N2Zz4K';
  }

  getNotaUsuario(itemId: number): number {
    const comentariosSalvos = localStorage.getItem("comentarios_" + itemId);
    
    if (comentariosSalvos) {
      const comentarios = JSON.parse(comentariosSalvos);

      if (comentarios.length > 0) {
        const ultimoComentario = comentarios[comentarios.length - 1];
        return ultimoComentario.nota;
      }
    }
    
    return 0;
  }
}