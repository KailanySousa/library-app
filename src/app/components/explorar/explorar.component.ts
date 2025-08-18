import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

type Livro = { titulo: string; autor: string; capa: string; descricao: string };

@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './explorar.component.html',
})
export class ExplorarComponent {
  jaLidos: Livro[] = [
    {
      titulo: 'A Biblioteca da Meia-Noite',
      autor: 'Matt Haig',
      capa: 'assets/capas/biblioteca-meia-noite.jpg',
      descricao: 'Uma viagem por vidas que poderiam ter sido.',
    },
    {
      titulo: 'Clean Code',
      autor: 'Robert C. Martin',
      capa: 'assets/capas/clean-code.jpg',
      descricao: 'Princípios práticos para escrever código melhor.',
    },
    {
      titulo: 'Dom Casmurro',
      autor: 'Machado de Assis',
      capa: 'assets/capas/dom-casmurro.jpg',
      descricao: 'Ciúme, memória e a dúvida que não se cala.',
    },
  ];

  desejos: Livro[] = [
    {
      titulo: 'Refactoring',
      autor: 'Martin Fowler',
      capa: 'assets/capas/refactoring.jpg',
      descricao: 'Melhorias incrementais com testes de segurança.',
    },
    {
      titulo: 'O Conto da Aia',
      autor: 'Margaret Atwood',
      capa: 'assets/capas/handmaids-tale.jpg',
      descricao: 'Distopia afiada sobre poder e controle.',
    },
    {
      titulo: 'You Don’t Know JS Yet',
      autor: 'Kyle Simpson',
      capa: 'assets/capas/ydkjs.jpg',
      descricao: 'Mergulho nas entranhas do JavaScript.',
    },
  ];

  faltando: Livro[] = [
    {
      titulo: '1984',
      autor: 'George Orwell',
      capa: 'assets/capas/1984.jpg',
      descricao: 'Vigiar e punir, agora com telão.',
    },
    {
      titulo: 'O Sol é para Todos',
      autor: 'Harper Lee',
      capa: 'assets/capas/sol-para-todos.jpg',
      descricao: 'Infância, justiça e o peso do preconceito.',
    },
    {
      titulo: 'Sapiens',
      autor: 'Yuval Noah Harari',
      capa: 'assets/capas/sapiens.jpg',
      descricao: 'Uma história breve da humanidade.’',
    },
  ];
}
