import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinhaListaService } from '../services/minha-lista.service';

@Component({
  selector: 'app-pagina-minha-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagina-minha-lista.html',
  styleUrls: ['./pagina-minha-lista.css']
})
export class PaginaMinhaListaComponent {

  lista: any[] = [];

  constructor(private minhaListaService: MinhaListaService) {}

  ngOnInit() {
    this.carregarLista();
  }

  carregarLista() {
    this.lista = this.minhaListaService.obterLista();
  }

  removerDaLista(id: number) {
    this.minhaListaService.remover(id);
    this.carregarLista();
  }
}
