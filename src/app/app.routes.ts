import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login';
import { Register} from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { History } from './components/history/history';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'history', component: History, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];