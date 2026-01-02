import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';      
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { History } from './components/history/history';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [{ path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] }, 
  { path: 'history', component: History, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }];
