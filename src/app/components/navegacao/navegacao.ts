import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navegacao',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navegacao.html',
  styleUrls: ['./navegacao.css']
})
export class NavegacaoComponent {
  termoBusca: string = '';
  mostrarBusca: boolean = false;

  constructor(private router: Router) {}

  toggleBusca(): void {
    this.mostrarBusca = !this.mostrarBusca;
    if (!this.mostrarBusca) {
      this.termoBusca = '';
    }
  }

  buscar(): void {
    if (this.termoBusca.trim()) {
      this.router.navigate(['/busca'], { queryParams: { q: this.termoBusca.trim() } });
      this.mostrarBusca = false;
      this.termoBusca = '';
    }
  }

  fecharBusca(): void {
    this.mostrarBusca = false;
    this.termoBusca = '';
  }
}