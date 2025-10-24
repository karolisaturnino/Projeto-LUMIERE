import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavegacaoComponent } from './components/navegacao/navegacao';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavegacaoComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  host: {
    class: 'app-root'
  }
})
export class App {
  title = 'Lumiere';
}