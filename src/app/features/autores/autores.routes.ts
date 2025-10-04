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
        path: 'lista',
        loadComponent: () =>
          import('./lista/lista.component').then(
            (m) => m.ListaAutoresComponent
          ),
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
