import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';
import { AuthGuard } from '../guard/auth.guard';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AboutComponent } from './components/about/about.component';
import { PrecautionsComponent } from './components/precautions/precautions.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'admin',
    redirectTo: 'admin/login',
    pathMatch: 'full'
  },

  {
    path: 'admin/login',
    component: AdminLoginComponent
  },
  {
    path: 'admin/register',
    component: AdminRegisterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/home',
    component: AdminHomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'precautions',
    component: PrecautionsComponent
  },
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
