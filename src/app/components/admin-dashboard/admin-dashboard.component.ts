import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MapDataService } from './map-data.service';
import { FormBuilder } from '@angular/forms';
import * as SignalR from '@microsoft/signalr';
import { baseString } from '../../../urls/basestring.url';
import { APIResponse } from '../../../response/api.response';
import { AffectedAreaService } from './admin-map/affected-area.service';
import { RefugeeCampService } from './admin-map/refugee-camp.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements AfterViewInit, OnInit, OnDestroy {

  // Model Variables for the form inputs
  refugeeCampLatitude: string = '';
  refugeeCampLongitude: string = '';
  affectedAreaLatitude: string = '';
  affectedAreaLongitude: string = '';
  affectedAreaRadius: string = '';
  affectedAreaSeverity: string = '';
  disasterType: string = '';

  // Arrays to hold refugee camps and affected areas
  refugeeCamps: any[] = [];

  affectedAreas: any[] = [];

  connection: SignalR.HubConnection = null!

  AffectedpickMode: boolean = false;
  RefugeepickMode: boolean = false;
  private coordinatesSubscription: Subscription | null = null;

  constructor(private fb: FormBuilder, private mapDataService: MapDataService, private areaService: AffectedAreaService, private campService: RefugeeCampService) {}

  ngOnInit() {
    this.subscribeToCoordinates();
    this.startSignalRConnection();
    this.updateMapOnNotification();
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

  private startSignalRConnection(): void {
    this.connection = new SignalR.HubConnectionBuilder()
    .withUrl(`${baseString}/notificationhub`)
    .build();
    this.connection
    .start()
    .catch(err => console.error('Error while starting SignalR connection: ' + err));
  }

  private updateMapOnNotification(): void {
    this.showAllAffectedAreas();
    this.showAllRefugeeCamps();
    this.connection.on('DataUpdated', () => {
      this.deleteAllAffectedAreas();
      this.showAllAffectedAreas();

      this.deleteAllRefugeeCamps();
      this.showAllRefugeeCamps();
    });
    this.connection.onreconnected(() => {
      this.deleteAllAffectedAreas();
      this.showAllAffectedAreas();

      this.deleteAllRefugeeCamps();
      this.showAllRefugeeCamps();
    });
  }

  private showAllAffectedAreas(): void {
    this.areaService.getAllAffectedArea()
    .subscribe({
      next: (data: APIResponse) => this.affectedAreas = data.message,
      error: (errorData: any) => console.error(errorData.error.message)
    });
  }

  private deleteAllAffectedAreas(): void {
    this.affectedAreas = []
  }

  private showAllRefugeeCamps(): void {
    this.campService.getAllRefugeeCamps()
    .subscribe({
      next: (data: APIResponse) => this.refugeeCamps = data.message,
      error: (errorData: any) => console.error(errorData.error.message),
    });
  }

  private deleteAllRefugeeCamps(): void {
    this.refugeeCamps = []
  }

  private initMap(): void {
    // Initialize the map here if needed
    // Note: The actual map initialization should be done in the AdminMapComponent
    // This method might not be necessary in the AdminDashboardComponent
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

  addAffectedArea() {
    if (this.affectedAreaLatitude && this.affectedAreaLongitude && this.affectedAreaRadius && this.affectedAreaSeverity && this.disasterType) {
      console.log('Affected Area Added:', this.affectedAreaLatitude, this.affectedAreaLongitude, this.affectedAreaRadius, this.affectedAreaSeverity, this.disasterType);
      this.affectedAreas.push({
        id: Date.now(),
        latitude: this.affectedAreaLatitude,
        longitude: this.affectedAreaLongitude,
        radius: this.affectedAreaRadius,
        severity: this.affectedAreaSeverity,
        disasterType: this.disasterType
      });
      this.resetAffectedAreaForm(); // Ensure this does not clear data prematurely
    }
  }


  updateCamp(id: number) {
    console.log('Update Refugee Camp ID:', id);
    // Implement update logic here
  }

  deleteCamp(id: number) {
    this.campService.deleteRefugeeCamp(id)
    .subscribe({
      error: (errorData: any) => console.log(errorData.error.message)
    })
  }

  updateArea(id: number) {
    console.log('Update Affected Area ID:', id);
    // Implement update logic here
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
    this.affectedAreaLatitude = '';
    this.affectedAreaLongitude = '';
    this.affectedAreaRadius = '';
    this.affectedAreaSeverity = '';
    this.disasterType = '';
    this.AffectedpickMode = false;
    this.mapDataService.setPickMode(false, null);
    this.clearMarker();
  }
}