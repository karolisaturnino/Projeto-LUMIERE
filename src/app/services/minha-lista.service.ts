import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MinhaListaService {

  private chave = 'minhaLista';

  constructor() {}

  obterLista() {
    const lista = localStorage.getItem(this.chave);
    return lista ? JSON.parse(lista) : [];
  }

  adicionar(item: any) {
    const lista = this.obterLista();

    // evita duplicados
    if (!lista.some((i: any) => i.id === item.id)) {
      lista.push(item);
      localStorage.setItem(this.chave, JSON.stringify(lista));
    }
  }

  remover(id: number) {
    let lista = this.obterLista();
    lista = lista.filter((item: any) => item.id !== id);
    localStorage.setItem(this.chave, JSON.stringify(lista));
  }
}
