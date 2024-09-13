import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapDataService } from './map-data.service';


import { FormBuilder } from '@angular/forms';
import * as SignalR from '@microsoft/signalr';
import { baseString } from '../../../urls/basestring.url';
import { APIResponse } from '../../../response/api.response';
import { AffectedAreaService } from './admin-map/affected-area.service';
import { RefugeeCampService } from './admin-map/refugee-camp.service';
import { AuthGuard } from '../../../guard/auth.guard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements AfterViewInit, OnInit, OnDestroy {

  // Refugee Camp form inputs
  refugeeCampLatitude: string = '';
  refugeeCampLongitude: string = '';
  selectedCampId: string = '';
  // Affected Area form inputs
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

  // New properties for Affected Area form
  selectedAreaId: string = '';
  isEditing: boolean = false;
  isEditingCamp: boolean = false;

  constructor(private fb: FormBuilder, private guard: AuthGuard, private router: Router, private mapDataService: MapDataService, private areaService: AffectedAreaService, private campService: RefugeeCampService) { }

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

  private async checkValidation(): Promise<void> {
    while (true) {
      if (!await this.guard.canActivate())
        break
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    alert('Your Login has expired')
    this.router.navigate(['admin/login'])
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

  onCampSelectionChange() {
    if (this.selectedCampId.startsWith('area_')) {
      // User selected an area to add a new camp
      const areaId = parseInt(this.selectedCampId.split('_')[1]);
      const selectedArea = this.affectedAreas.find(area => area.areaId === areaId);
      if (selectedArea) {
        this.refugeeCampLatitude = selectedArea.latitude;
        this.refugeeCampLongitude = selectedArea.longitude;
      }
      this.isEditingCamp = true;
    } else if (this.selectedCampId) {
      // User selected a camp to update
      const campId = parseInt(this.selectedCampId);
      const selectedCamp = this.refugeeCamps.find(camp => camp.campId === campId);
      if (selectedCamp) {
        this.refugeeCampLatitude = selectedCamp.latitude;
        this.refugeeCampLongitude = selectedCamp.longitude;
      }
      this.isEditingCamp = true;
    } else {
      // User selected "Add New Camp"
      this.resetRefugeeCampForm();
      this.isEditingCamp = false;
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

  updateRefugeeCamp() {
    if (this.validateRefugeeCampForm()) {

      const index = this.refugeeCamps.findIndex(camp => camp.id === parseInt(this.selectedCampId));
      if (index !== -1)
        return
      this.campService.updateRefugeeCamp(
        Number(this.selectedCampId),
        Number(this.refugeeCampLatitude),
        Number(this.refugeeCampLongitude)
      )
        .subscribe({
          error: (errorData: any) => console.log(errorData.error.message)
        })
    }
  }




  onAreaIdChange() {
    if (this.selectedAreaId) {
      const selectedArea = this.affectedAreas.find(area => area.areaId === parseInt(this.selectedAreaId));
      if (selectedArea) {
        this.fillFormWithAreaData(selectedArea);
        this.isEditing = true;
      }
    } else {
      this.resetAffectedAreaForm();
      this.isEditing = false;
    }

  }




  fillFormWithAreaData(area: any) {
    this.affectedAreaLatitude = area.latitude;
    this.affectedAreaLongitude = area.longitude;
    this.affectedAreaRadius = area.radius;
    this.affectedAreaSeverity = area.severity;
    this.disasterType = area.disasterType;
  }

  getSeverity(severity: number): string {
    switch (severity) {
      case 1: return 'Moderate'
      case 2: return 'High'
      case 3: return 'Severe'
      default: return 'Unknown'
    }
  }

  addOrUpdateAffectedArea() {
    if (this.isEditing) {
      this.updateAffectedArea();
    } else {
      this.addAffectedArea();
    }
  }

  addOrUpdateRefugeeCamp() {
    if (this.isEditingCamp) {
      this.updateRefugeeCamp();
    } else {
      this.addRefugeeCamp();
    }
  }

  addAffectedArea() {
    if (!this.validateAffectedAreaForm())
      return
    this.areaService.addAffectedArea(
      Number(this.affectedAreaLatitude),
      Number(this.affectedAreaLongitude),
      Number(this.affectedAreaRadius),
      Number(this.affectedAreaSeverity),
      this.disasterType
    )
      .subscribe({
        error: (errorData: any) => console.log(errorData.error.message)
      })
  }

  updateAffectedArea() {
    if (!this.validateAffectedAreaForm())
      return
    this.areaService.updateAffectedArea(
      Number(this.selectedAreaId),
      Number(this.affectedAreaLatitude),
      Number(this.affectedAreaLongitude),
      Number(this.affectedAreaRadius),
      Number(this.affectedAreaSeverity),
      this.disasterType
    )
      .subscribe({
        error: (errorData: any) => console.log(errorData.error.message)
      })
  }

  validateAffectedAreaForm(): boolean {
    return !!(this.affectedAreaLatitude && this.affectedAreaLongitude &&
      this.affectedAreaRadius && this.affectedAreaSeverity && this.disasterType);
  }

  validateRefugeeCampForm(): boolean {
    return !!(this.refugeeCampLatitude && this.refugeeCampLongitude);
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
    const areaToUpdate = this.affectedAreas.find(area => area.id === id);
    if (areaToUpdate) {
      this.selectedAreaId = id.toString();
      this.fillFormWithAreaData(areaToUpdate);
      this.isEditing = true;
    }
  }

  deleteArea(id: number) {
    this.areaService.deleteAffectedArea(id)
      .subscribe({
        error: (errorData: any) => console.log(errorData.error.message)
      })
  }

  private resetRefugeeCampForm() {
    this.refugeeCampLatitude = '';
    this.refugeeCampLongitude = '';
    this.RefugeepickMode = false;
    this.isEditingCamp = false;
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