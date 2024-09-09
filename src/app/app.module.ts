import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpInterceptor } from '@angular/common/http';

import { AdminLoginComponent } from '../admin-login/admin-login.component';
import { AdminRegisterComponent } from '../admin-register/admin-register.component';
import { AdminHomeComponent } from '../admin-home/admin-home.component';

import { AdminInterceptor } from '../interceptor/admin.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    AdminRegisterComponent,
    AdminHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    provideHttpClient(withInterceptors([AdminInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
