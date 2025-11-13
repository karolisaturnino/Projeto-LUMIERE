import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navegacao',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navegacao.html',
  styleUrls: ['./navegacao.css']
})
export class NavegacaoComponent implements OnInit {
  termoBusca: string = '';
  mostrarBusca: boolean = false;
  paginaAtiva: string = '/';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.paginaAtiva = event.url;
      });
  }

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

  isPaginaAtiva(rota: string): boolean {
    return this.paginaAtiva === rota;
  }
}