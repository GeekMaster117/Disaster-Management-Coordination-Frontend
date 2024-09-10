import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
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

  // Arrays to hold refugee camps and affected areas
  refugeeCamps = [
    // Example data
    { id: 1, latitude: '12.34', longitude: '56.78' }
  ];

  affectedAreas = [
    // Example data
    { id: 1, latitude: '12.34', longitude: '56.78', radius: '10km', severity: 'High', disasterType: 'Flood' }
  ];

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
    // Example: Add to the list
    this.refugeeCamps.push({ id: Date.now(), latitude: this.refugeeCampLatitude, longitude: this.refugeeCampLongitude });
  }

  addAffectedArea() {
    // Handle adding affected area functionality here
    console.log('Affected Area Added:', this.affectedAreaLatitude, this.affectedAreaLongitude, this.affectedAreaRadius, this.affectedAreaSeverity, this.disasterType);
    // Example: Add to the list
    this.affectedAreas.push({ id: Date.now(), latitude: this.affectedAreaLatitude, longitude: this.affectedAreaLongitude, radius: this.affectedAreaRadius, severity: this.affectedAreaSeverity, disasterType: this.disasterType });
  }

  updateCamp(id: number) {
    // Handle update functionality
    console.log('Update Refugee Camp ID:', id);
  }

  deleteCamp(id: number) {
    // Handle delete functionality
    this.refugeeCamps = this.refugeeCamps.filter(camp => camp.id !== id);
    console.log('Deleted Refugee Camp ID:', id);
  }

  updateArea(id: number) {
    // Handle update functionality
    console.log('Update Affected Area ID:', id);
  }

  deleteArea(id: number) {
    // Handle delete functionality
    this.affectedAreas = this.affectedAreas.filter(area => area.id !== id);
    console.log('Deleted Affected Area ID:', id);
  }
}
