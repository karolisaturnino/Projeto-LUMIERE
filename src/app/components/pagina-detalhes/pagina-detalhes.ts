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

  // ==============================
  //        MINHA LISTA
  // ==============================
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

  // ==============================
  //     CARREGAR DETALHES
  // ==============================
  carregarDetalhes(id: number): void {
    this.carregando = true;

    const callback = (item: any) => {
      this.item = item;
      this.carregando = false;

      // carregar comentários depois que item chega
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

  // ==============================
  //            VOLTAR
  // ==============================
  voltar(): void {
    this.router.navigate(['/']);
  }

  irParaDetalhes(tipo: 'filme' | 'serie', id: number): void {
    this.router.navigate(['/detalhes', tipo, id]);
  }

  // ==============================
  //   IMAGENS DO TMDB
  // ==============================
  obterUrlImagem(caminho: string): string {
    if (!caminho) {
      return 'data:image/svg+xml;base64,...';
    }
    return `https://image.tmdb.org/t/p/w500${caminho}`;
  }

  obterUrlImagemGrande(caminho: string): string {
    if (!caminho) {
      return 'data:image/svg+xml;base64,...';
    }
    return `https://image.tmdb.org/t/p/w1280${caminho}`;
  }

  // ==============================
  //      TIPAGEM FILME/SÉRIE
  // ==============================
  eFilme(item: any): item is Filme {
    return this.tipo === 'filme';
  }

  eSerie(item: any): item is Serie {
    return this.tipo === 'serie';
  }

  // ==============================
  //   ⭐ SISTEMA DE COMENTÁRIOS ⭐
  // ==============================

  novoComentario: string = "";
  estrelasArray = [1,2,3,4,5,6,7,8,9,10];
  novaNota =0;
  comentarios: any[] = [];

 
  // Carrega comentários do localStorage
  carregarComentarios() {
    if (!this.item) return;

    const salvo = localStorage.getItem("comentarios_" + this.item.id);
    this.comentarios = salvo ? JSON.parse(salvo) : [];
  }

  // Salva no localStorage
  salvarComentarios() {
    if (!this.item) return;

    localStorage.setItem("comentarios_" + this.item.id, JSON.stringify(this.comentarios));
  }

  // Adiciona novo comentário
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
    this.novaNota = 5;
  }
 selecionarNota(nota: number) {
  this.novaNota = nota;
}
}
