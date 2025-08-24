import { Routes } from '@angular/router';
import { CategoriasComponent } from './categorias.component';

export const categoriasRoutes: Routes = [
  {
    path: '',
    component: CategoriasComponent,
    children: [
      {
        path: 'nova',
        loadComponent: () =>
          import('./nova/nova.component').then((m) => m.NovaComponent),
      },
      {
        path: 'lista',
        loadComponent: () =>
          import('./lista/lista.component').then((m) => m.ListaComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./detalhe/detalhe.component').then((m) => m.DetalheComponent),
      },
    ],
  },
];
