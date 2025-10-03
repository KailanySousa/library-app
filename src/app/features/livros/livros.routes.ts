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
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
