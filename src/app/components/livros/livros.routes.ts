import { Routes } from '@angular/router';

export const livrosRoutes: Routes = [
  {
    path: 'novo',
    loadComponent: () =>
      import('./novo/novo.component').then((m) => m.NovoComponent),
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
