import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  livros = [
    {
      titulo: 'Angular Essencial',
      autor: 'Rodrigo Branas',
      capa: '/favicon.ico',
      descricao: 'Um guia prático para aprender Angular.',
    },
    {
      titulo: 'Clean Code',
      autor: 'Robert C. Martin',
      capa: 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX374_BO1,204,203,200_.jpg',
      descricao: 'Princípios e boas práticas para escrever código limpo.',
    },
    {
      titulo: 'Design Patterns',
      autor: 'Erich Gamma et al.',
      capa: 'https://m.media-amazon.com/images/I/51kuc0iWo2L._SX379_BO1,204,203,200_.jpg',
      descricao: 'Catálogo clássico de padrões de projeto.',
    },
  ];
}
