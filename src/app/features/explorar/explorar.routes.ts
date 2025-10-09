import { Routes } from '@angular/router';

export const explorarRoutes: Routes = [
  {
    path: '',

    children: [
      {
        path: '',
        loadComponent: () =>
          import('./explorar.component').then((m) => m.ExplorarComponent),
      },
      {
        path: 'ver-mais',
        loadComponent: () =>
          import('./ver-mais/ver-mais.component').then(
            (m) => m.VerMaisComponent
          ),
      },
    ],
  },
];
