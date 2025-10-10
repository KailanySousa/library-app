import { Routes } from '@angular/router';

export const autoresRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'novo',
        loadComponent: () =>
          import('./novo/novo.component').then((m) => m.NovoAutorComponent),
      },
      {
        path: '',
        loadComponent: () =>
          import('./autores.component').then((m) => m.AutoresComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./detalhe/detalhe.component').then(
            (m) => m.DetalheAutorComponent
          ),
      },
    ],
  },
];
