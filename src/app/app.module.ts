import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { AdminInterceptor } from '../interceptor/admin.interceptor';

import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AboutComponent } from './components/about/about.component';
import { PrecautionsComponent } from './components/precautions/precautions.component';
import { LegendCardComponent } from './components/dashboard/legend-card/legend-card.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { EarthquakeHeadlinesComponent } from './components/dashboard/earthquake-headlines/earthquake-headlines.component';
import { MapComponent } from './components/dashboard/map/map.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminMapComponent } from './components/admin-dashboard/admin-map/admin-map.component';
import { MapDataService } from './components/admin-dashboard/map-data.service';

@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    AdminRegisterComponent,
    NavbarComponent,
    AboutComponent,
    PrecautionsComponent,
    LegendCardComponent,
    DashboardComponent,
    EarthquakeHeadlinesComponent,
    MapComponent,
    AdminDashboardComponent,
    NotFoundComponent,
    FooterComponent,
    AdminMapComponent
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
    provideHttpClient(withInterceptors([AdminInterceptor])),
    MapDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
