import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLoginComponent } from '../admin-login/admin-login.component';
import { AdminRegisterComponent } from '../admin-register/admin-register.component';
import { AuthGuard } from '../guard/auth.guard';
import { AdminHomeComponent } from '../admin-home/admin-home.component';
import { AboutComponent } from './components/about/about.component';

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
    component: AdminHomeComponent
  },
  {
    path: 'about',
    component: AboutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
