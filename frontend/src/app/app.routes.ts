import { Routes } from '@angular/router';

// Lazy loading dei componenti per prestazioni migliori
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'dettaglio/:id',
    loadComponent: () => import('./components/dettaglio/dettaglio.component').then(m => m.DettaglioComponent)
  },
  {
    path: 'aggiungi',
    loadComponent: () => import('./components/aggiungi/aggiungi.component').then(m => m.AggiungiComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
