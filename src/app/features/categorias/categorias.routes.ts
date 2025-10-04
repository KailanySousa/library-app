import { Routes } from '@angular/router';

export const categoriasRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'nova',
        loadComponent: () =>
          import('./nova/nova.component').then((m) => m.NovaCategoriaComponent),
      },
      {
        path: 'lista',
        loadComponent: () =>
          import('./lista/lista.component').then(
            (m) => m.ListaCategoriasComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./detalhe/detalhe.component').then(
            (m) => m.DetalheCategoriaComponent
          ),
      },
    ],
  },
];
