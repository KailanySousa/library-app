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
    path: 'novo',
    loadComponent: () =>
      import('./components/novo/novo.component').then((m) => m.NovoComponent),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
