import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'explorar',
    loadChildren: () =>
      import('./features/explorar/explorar.routes').then(
        (m) => m.explorarRoutes
      ),
  },
  {
    path: 'livros',
    loadChildren: () =>
      import('./features/livros/livros.routes').then((m) => m.livrosRoutes),
  },
  {
    path: 'categorias',
    loadChildren: () =>
      import('./features/categorias/categorias.routes').then(
        (m) => m.categoriasRoutes
      ),
  },
  {
    path: 'autores',
    loadChildren: () =>
      import('./features/autores/autores.routes').then((m) => m.autoresRoutes),
  },
  {
    path: 'configuracoes',
    loadComponent: () =>
      import('./features/configuracoes/configuracoes.component').then(
        (m) => m.ConfiguracoesComponent
      ),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
