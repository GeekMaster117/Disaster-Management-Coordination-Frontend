import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { AdminLoginComponent } from '../admin-login/admin-login.component';
import { AdminRegisterComponent } from '../admin-register/admin-register.component';
import { AdminHomeComponent } from '../admin-home/admin-home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AboutComponent } from './components/about/about.component';
import { PrecautionsComponent } from './components/precautions/precautions.component';
import { LegendCardComponent } from './components/dashboard/legend-card/legend-card.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { EarthquakeHeadlinesComponent } from './components/dashboard/earthquake-headlines/earthquake-headlines.component';
import { MapComponent } from './components/dashboard/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    AdminRegisterComponent,
    AdminHomeComponent,
    NavbarComponent,
    AboutComponent,
    PrecautionsComponent,
    LegendCardComponent,
    DashboardComponent,
    EarthquakeHeadlinesComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    DragDropModule
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
