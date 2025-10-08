import { Routes } from '@angular/router';

export const livrosRoutes: Routes = [
  {
    path: 'novo',
    loadComponent: () =>
      import('./novo/novo.component').then((m) => m.NovoLivroComponent),
  },
  {
    path: 'lista',
    loadComponent: () =>
      import('./lista/lista.component').then((m) => m.ListaLivrosComponent),
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
