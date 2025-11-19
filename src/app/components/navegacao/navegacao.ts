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
  paginaAtiva: string = '/';

  usuarioLogado: boolean = false;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {

    // Detecta troca de rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.paginaAtiva = event.url;
      });

    // Detecta login/logout em tempo real
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

  irParaLogin() {
    this.router.navigate(['/auth']);
  }

  irParaMinhaLista() {
    this.router.navigate(['/minha-lista']);
  }

  isPaginaAtiva(rota: string): boolean {
    return this.paginaAtiva === rota;
  }

}
