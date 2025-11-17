import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      
      <!-- LOGIN -->
      <div *ngIf="modo === 'login'">
        <h2>Login</h2>

        <form (ngSubmit)="fazerLogin()">
          <input 
            type="email" 
            placeholder="Email"
            [(ngModel)]="email" 
            name="email" 
            required
          >

          <input 
            type="password" 
            placeholder="Senha"
            [(ngModel)]="senha" 
            name="senha" 
            required
          >

          <button type="submit">Entrar</button>
        </form>

        <p class="mudar" (click)="irParaRegistro()">
          Não tem conta? <strong>Criar conta</strong>
        </p>

        <p *ngIf="erro" class="erro">{{ erro }}</p>
      </div>


      <!-- REGISTRO -->
      <div *ngIf="modo === 'registro'">
        <h2>Criar Conta</h2>

        <form (ngSubmit)="fazerRegistro()">
          <input 
            type="email" 
            placeholder="Email"
            [(ngModel)]="email" 
            name="email" 
            required
          >

          <input 
            type="password" 
            placeholder="Senha"
            [(ngModel)]="senha" 
            name="senha" 
            required
          >

          <button type="submit">Registrar</button>
        </form>

        <p class="mudar" (click)="irParaLogin()">
          Já tem conta? <strong>Fazer login</strong>
        </p>

        <p *ngIf="erro" class="erro">{{ erro }}</p>
      </div>

    </div>
  `,
  styles: [`
    .auth-container {
      max-width: 350px;
      margin: 40px auto;
      padding: 20px;
      border-radius: 10px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    input {
      width: 100%;
      margin: 10px 0;
      padding: 10px;
    }

    button {
      width: 100%;
      padding: 10px;
      background: #5e44ff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .mudar {
      margin-top: 15px;
      text-align: center;
      cursor: pointer;
      color: #5e44ff;
    }

    .erro {
      color: red;
      margin-top: 10px;
      text-align: center;
    }
  `]
})export class AuthComponent {
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
  console.log("Chamou registro!", this.email, this.senha);

  this.authService.register(this.email, this.senha).subscribe({
    next: () => {
      alert('Conta criada com sucesso!');
      this.router.navigate(['/']);
    },
    error: (err) => {
      console.error("ERRO AO CRIAR CONTA:", err);
      alert('Erro ao criar conta. Verifique email e senha.');
    }
  });
}
}