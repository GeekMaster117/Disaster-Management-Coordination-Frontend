import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements AfterViewInit {

  // Model Variables for the form inputs
  refugeeCampLatitude: string = '';
  refugeeCampLongitude: string = '';
  affectedAreaLatitude: string = '';
  affectedAreaLongitude: string = '';
  affectedAreaRadius: string = '';
  affectedAreaSeverity: string = '';
  disasterType: string = '';

  private map: any;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  addRefugeeCamp() {
    // Handle adding refugee camp functionality here
    console.log('Refugee Camp Added:', this.refugeeCampLatitude, this.refugeeCampLongitude);
  }

  addAffectedArea() {
    // Handle adding affected area functionality here
    console.log('Affected Area Added:', this.affectedAreaLatitude, this.affectedAreaLongitude, this.affectedAreaRadius, this.affectedAreaSeverity, this.disasterType);
  }
}