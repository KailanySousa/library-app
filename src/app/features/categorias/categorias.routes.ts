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
        path: '',
        loadComponent: () =>
          import('./categorias.component').then((m) => m.CategoriasComponent),
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
