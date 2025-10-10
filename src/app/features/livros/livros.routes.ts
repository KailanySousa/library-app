import { Routes } from '@angular/router';

export const livrosRoutes: Routes = [
  {
    path: 'novo',
    loadComponent: () =>
      import('./novo/novo.component').then((m) => m.NovoLivroComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./livros.component').then((m) => m.LivrosComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./detalhe/detalhe.component').then(
        (m) => m.DetalheLivroComponent
      ),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
