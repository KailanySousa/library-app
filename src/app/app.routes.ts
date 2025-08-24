import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'explorar',
    loadComponent: () =>
      import('./components/explorar/explorar.component').then(
        (m) => m.ExplorarComponent
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
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
