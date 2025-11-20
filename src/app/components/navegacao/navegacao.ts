import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

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
  paginaAtual: string = '/';
  menuAberto: boolean = false;
  perfilExpandido: boolean = false;

  usuarioLogado: boolean = false;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.paginaAtual = event.url;
        this.fecharMenu();
      });

    this.authService.user$.subscribe(user => {
      this.usuarioLogado = !!user;
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

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }

  expandirPerfil(): void {
    this.perfilExpandido = true;
  }

  recolherPerfil(): void {
    this.perfilExpandido = false;
  }

  irParaLogin() {
    this.router.navigate(['/auth']);
  }

  isPaginaAtiva(rota: string): boolean {
    return this.paginaAtual === rota;
  }
}