// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User 
} from '@angular/fire/auth';
import { authState } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.user$ = authState(this.auth);
  }


  
  

  register(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(signOut(this.auth));
  }
 getCurrentUser(): Promise<User | null> {
    return this.auth.currentUser 
      ? Promise.resolve(this.auth.currentUser) 
      : Promise.resolve(null);
  }
  getUsuarioAtual(): Promise<User | null> {
    return this.getCurrentUser();
  }
}
