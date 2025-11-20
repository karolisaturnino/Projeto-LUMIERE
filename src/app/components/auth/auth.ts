import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent {
  email = '';
  senha = '';
  erro = '';

  modo: 'login' | 'registro' = 'login';

  constructor(private authService: AuthService, private router: Router) {}

  irParaLogin() {
    this.modo = 'login';
    this.erro = '';
  }

  irParaRegistro() {
    this.modo = 'registro';
    this.erro = '';
  }

  fazerLogin() {
    this.erro = '';

    this.authService.login(this.email, this.senha).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.erro = 'Email ou senha incorretos.';
      }
    });
  }

  fazerRegistro() {
    this.erro = '';

    this.authService.register(this.email, this.senha).subscribe({
      next: () => {
        this.authService.login(this.email, this.senha).subscribe({
          next: () => {
            this.router.navigate(['/']);
          }
        });
      },
      error: (err) => {
        console.error("ERRO AO CRIAR CONTA:", err);
        this.erro = 'Erro ao criar conta. Verifique email e senha.';
      }
    });
  }
}