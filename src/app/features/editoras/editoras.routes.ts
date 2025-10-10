import { Routes } from '@angular/router';

export const editorasRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'nova',
        loadComponent: () =>
          import('./nova/nova.component').then((m) => m.NovaEditoraComponent),
      },
      {
        path: '',
        loadComponent: () =>
          import('./editoras.component').then((m) => m.EditorasComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./detalhe/detalhe.component').then(
            (m) => m.DetalheEditoraComponent
          ),
      },
    ],
  },
];
