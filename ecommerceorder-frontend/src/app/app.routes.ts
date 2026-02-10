import { Routes } from '@angular/router';
import { Login } from './login/login';
import { UserDashboard } from './dashboard/user-dashboard/user-dashboard';
import { AdminDashboard } from './dashboard/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'register', loadComponent: () => import('./register/register').then(m => m.Register) },
  { path: 'user-dashboard', component: UserDashboard },
  { path: 'admin-dashboard', component: AdminDashboard }
];
