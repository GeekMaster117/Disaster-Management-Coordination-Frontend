import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { MapDataService } from './map-data.service';

interface RefugeeCamp {
  id: number;
  latitude: string;
  longitude: string;
}

interface AffectedArea {
  id: number;
  latitude: string;
  longitude: string;
  radius: string;
  severity: string;
  disasterType: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements AfterViewInit, OnInit, OnDestroy {

  // Refugee Camp form inputs
  refugeeCampLatitude: string = '';
  refugeeCampLongitude: string = '';

  // Affected Area form inputs
  affectedAreaLatitude: string = '';
  affectedAreaLongitude: string = '';
  affectedAreaRadius: string = '';
  affectedAreaSeverity: string = '';
  disasterType: string = '';

  // Arrays to hold refugee camps and affected areas
  refugeeCamps: RefugeeCamp[] = [
    // Example data
    { id: 1, latitude: '12.34', longitude: '56.78' }
  ];

  affectedAreas: AffectedArea[] = [
    // Example data
    { id: 1, latitude: '12.34', longitude: '56.78', radius: '10km', severity: 'High', disasterType: 'Flood' },
    { id: 2, latitude: '23.45', longitude: '67.89', radius: '5km', severity: 'Moderate', disasterType: 'Earthquake' },
    { id: 3, latitude: '34.56', longitude: '78.90', radius: '15km', severity: 'Severe', disasterType: 'Hurricane' },
  ];

  private map: any;
  private marker: L.Marker | null = null;
  AffectedpickMode: boolean = false;
  RefugeepickMode: boolean = false;
  private coordinatesSubscription: Subscription | null = null;

  // New properties for Affected Area form
  selectedAreaId: string = '';
  isEditing: boolean = false;

  constructor(private mapDataService: MapDataService) {}

  ngOnInit() {
    this.subscribeToCoordinates();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.coordinatesSubscription) {
      this.coordinatesSubscription.unsubscribe();
    }
  }

  private subscribeToCoordinates() {
    this.coordinatesSubscription = this.mapDataService.getCoordinates().subscribe(coords => {
      if (coords) {
        this.updateLatLngInputs(coords.lat, coords.lng);
        this.addMarker(coords.lat, coords.lng);
      }
    });
  }

  private initMap(): void {
    // Initialize the map here if needed
    // Note: The actual map initialization should be done in the AdminMapComponent
  }

  toggleAffectedPickMode() {
    this.AffectedpickMode = !this.AffectedpickMode;
    this.RefugeepickMode = false; // Ensure only one pick mode is active at a time
    this.mapDataService.setPickMode(this.AffectedpickMode, 'affected');
    if (this.AffectedpickMode) {
      console.log('Affected Area Pick Mode activated');
    } else {
      console.log('Affected Area Pick Mode deactivated');
      this.clearMarker();
    }
  }

  toggleRefugeePickMode() {
    this.RefugeepickMode = !this.RefugeepickMode;
    this.AffectedpickMode = false; // Ensure only one pick mode is active at a time
    this.mapDataService.setPickMode(this.RefugeepickMode, 'refugee');
    if (this.RefugeepickMode) {
      console.log('Refugee Camp Pick Mode activated');
    } else {
      console.log('Refugee Camp Pick Mode deactivated');
      this.clearMarker();
    }
  }

  addMarker(lat: number, lng: number) {
    // This method might not be necessary in the AdminDashboardComponent
    // The marker addition should be handled in the AdminMapComponent
    console.log('Marker added at:', lat, lng);
  }

  clearMarker() {
    // This method might not be necessary in the AdminDashboardComponent
    // The marker clearing should be handled in the AdminMapComponent
    console.log('Marker cleared');
    this.mapDataService.setPickMode(false, null);
  }

  updateLatLngInputs(lat: number, lng: number) {
    if (this.AffectedpickMode) {
      this.affectedAreaLatitude = lat.toString();
      this.affectedAreaLongitude = lng.toString();
    }
    if (this.RefugeepickMode) {
      this.refugeeCampLatitude = lat.toString();
      this.refugeeCampLongitude = lng.toString();
    }
  }

  addRefugeeCamp() {
    if (this.refugeeCampLatitude && this.refugeeCampLongitude) {
      console.log('Refugee Camp Added:', this.refugeeCampLatitude, this.refugeeCampLongitude);
      this.refugeeCamps.push({
        id: Date.now(),
        latitude: this.refugeeCampLatitude,
        longitude: this.refugeeCampLongitude
      });
      this.resetRefugeeCampForm();
    }
  }

  onAreaIdChange() {
    if (this.selectedAreaId) {
      const selectedArea = this.affectedAreas.find(area => area.id === parseInt(this.selectedAreaId));
      if (selectedArea) {
        this.fillFormWithAreaData(selectedArea);
        this.isEditing = true;
      }
    } else {
      this.resetAffectedAreaForm();
      this.isEditing = false;
    }
  }
  
  fillFormWithAreaData(area: AffectedArea) {
    this.affectedAreaLatitude = area.latitude;
    this.affectedAreaLongitude = area.longitude;
    this.affectedAreaRadius = area.radius;
    this.affectedAreaSeverity = area.severity;
    this.disasterType = area.disasterType;
  }

  addOrUpdateAffectedArea() {
    if (this.isEditing) {
      this.updateAffectedArea();
    } else {
      this.addAffectedArea();
    }
  }

  addAffectedArea() {
    if (this.validateAffectedAreaForm()) {
      const newArea: AffectedArea = {
        id: Date.now(),
        latitude: this.affectedAreaLatitude,
        longitude: this.affectedAreaLongitude,
        radius: this.affectedAreaRadius,
        severity: this.affectedAreaSeverity,
        disasterType: this.disasterType
      };
      this.affectedAreas.push(newArea);
      console.log('Affected Area Added:', newArea);
      this.resetAffectedAreaForm();
    }
  }

  updateAffectedArea() {
    if (this.validateAffectedAreaForm()) {
      const index = this.affectedAreas.findIndex(area => area.id === parseInt(this.selectedAreaId));
      if (index !== -1) {
        this.affectedAreas[index] = {
          ...this.affectedAreas[index],
          latitude: this.affectedAreaLatitude,
          longitude: this.affectedAreaLongitude,
          radius: this.affectedAreaRadius,
          severity: this.affectedAreaSeverity,
          disasterType: this.disasterType
        };
        console.log('Affected Area Updated:', this.affectedAreas[index]);
        this.resetAffectedAreaForm();
      }
    }
  }

  validateAffectedAreaForm(): boolean {
    return !!(this.affectedAreaLatitude && this.affectedAreaLongitude && 
              this.affectedAreaRadius && this.affectedAreaSeverity && this.disasterType);
  }

  updateCamp(id: number) {
    console.log('Update Refugee Camp ID:', id);
    // Implement update logic here
  }

  deleteCamp(id: number) {
    this.refugeeCamps = this.refugeeCamps.filter(camp => camp.id !== id);
    console.log('Deleted Refugee Camp ID:', id);
  }

  updateArea(id: number) {
    console.log('Update Affected Area ID:', id);
    const areaToUpdate = this.affectedAreas.find(area => area.id === id);
    if (areaToUpdate) {
      this.selectedAreaId = id.toString();
      this.fillFormWithAreaData(areaToUpdate);
      this.isEditing = true;
    }
  }

  deleteArea(id: number) {
    this.affectedAreas = this.affectedAreas.filter(area => area.id !== id);
    console.log('Deleted Affected Area ID:', id);
  }

  private resetRefugeeCampForm() {
    this.refugeeCampLatitude = '';
    this.refugeeCampLongitude = '';
    this.RefugeepickMode = false;
    this.mapDataService.setPickMode(false, null);
    this.clearMarker();
  }

  private resetAffectedAreaForm() {
    this.selectedAreaId = '';
    this.affectedAreaLatitude = '';
    this.affectedAreaLongitude = '';
    this.affectedAreaRadius = '';
    this.affectedAreaSeverity = '';
    this.disasterType = '';
    this.AffectedpickMode = false;
    this.isEditing = false;
    this.mapDataService.setPickMode(false, null);
    this.clearMarker();
  }
}