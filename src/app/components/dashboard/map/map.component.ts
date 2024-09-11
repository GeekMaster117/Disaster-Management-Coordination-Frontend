import { Component, OnInit } from "@angular/core";
import * as Leaflet from 'leaflet'
import 'leaflet-routing-machine'
import { AffectedAreaService } from "./affected-area.service";
import * as SignalR from '@microsoft/signalr'
import { APIResponse } from "../../../../response/api.response";
import { baseString } from "../../../../urls/basestring.url";
import { RefugeeCampService } from "./refugee-camp.service";
import { isPlatformServer } from "@angular/common";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
  private map: Leaflet.Map = null!
  private defaultLocation: Leaflet.LatLng = new Leaflet.LatLng(8.5241, 76.9366)
  private defaultZoom: number = 14

  private followUser: boolean = true
  private userLocationMarker: Leaflet.Marker = null!

  private icons: Map<string, Leaflet.Icon> = new Map<string, Leaflet.Icon>

  private connection: SignalR.HubConnection = null!
  
  private affectedAreasData: any[] = []
  private affectedAreasCircle: Leaflet.Circle[] = []
  private refugeeCampsData: any[] = []
  private refugeeCampsMarker: Leaflet.Marker[] = []

  private routeLayer: Leaflet.Routing.Line | null = null

  public constructor(private areaService: AffectedAreaService, private campService: RefugeeCampService) {}

  public ngOnInit(): void {
    this.addIcons()
    this.startSignalRConnection()
    this.updateMapOnNotification()
    this.initMap()
    this.showUserLocation()
  }

  private addIcons(): void {
    const userLocationIcon: Leaflet.Icon = Leaflet.icon({
        iconUrl: 'assets/location-marker.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
    this.icons.set('userLocation', userLocationIcon)

    const refugeeCampIcon: Leaflet.Icon = Leaflet.icon({
      iconUrl: 'assets/camp.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -35]
    })
    this.icons.set('refugeeCamp', refugeeCampIcon)
  }

  private startSignalRConnection(): void {
    this.connection = new SignalR.HubConnectionBuilder()
    .withUrl(`${baseString}/notificationhub`)
    .build()
    this.connection
    .start()
    .catch(err => console.error('Error while starting SignalR connection: ' + err));
  }

  private updateMapOnNotification(): void {
    this.showAllAffectedAreas()
    this.showAllRefugeeCamps()
    this.connection.on('DataUpdated', () => {
      this.deleteAllAffectedAreas()
      this.showAllAffectedAreas()

      this.deleteAllRefugeeCamps()
      this.showAllRefugeeCamps()
    })
    this.connection.onreconnected(() => {
      this.deleteAllAffectedAreas()
      this.showAllAffectedAreas()

      this.deleteAllRefugeeCamps()
      this.showAllRefugeeCamps()
    })
  }

  private initMap(): void {
    this.map = Leaflet.map('map').setView(this.defaultLocation, this.defaultZoom)
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://www.flaticon.com/free-icons/tent-house" title="tent house icons">Tent house icons created by VectorPortal - Flaticon</a>'
        })
        .addTo(this.map);
    this.map.on('click', () => this.deleteLine())
  }

  private deleteLine(): void {
    if (this.routeLayer)
    {
      console.log('Removing route layer');
      this.routeLayer = null
    }
  }

  private async showUserLocation(): Promise<void> {
    while(true)
    {
      await this.getCurrentLocation()
      .then((location: Leaflet.LatLng) => {
          if (this.userLocationMarker && location.distanceTo(this.userLocationMarker.getLatLng()) <= 10)
              return

          if (this.userLocationMarker)
            this.userLocationMarker.remove()

          this.userLocationMarker = Leaflet.marker(location, {
              icon: this.icons.get('userLocation'),
              draggable: false
          })
          .addTo(this.map)
          .bindPopup(`Your location ${location.lat}, ${location.lng}`)

          if (this.followUser)
              this.map.panTo(location)
      })
      .catch((error: any) => console.log(error))
    }
  }

  private getCurrentLocation(): Promise<Leaflet.LatLng> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => resolve(new Leaflet.LatLng(position.coords.latitude, position.coords.longitude)),
            (error) => reject(error)
        )
    })
  }

  private showAllAffectedAreas(): void {
    this.areaService.getAllAffectedArea()
    .subscribe({
      next: (data: APIResponse) => {
        this.affectedAreasData = data.message
      },
      error: (errorData: any) => console.error(errorData.error.message),
      complete: () => {
        for (let area of this.affectedAreasData)
        {
          let fillColor: string = null!
          switch(area.severity)
          {
            case 1: fillColor = "yellow"
            break
            case 2: fillColor = "orange"
            break
            case 3: fillColor = "red"
            break
          }
          let circle: Leaflet.Circle = Leaflet.circle([area.latitude, area.longitude], {
            radius: area.radius,
            fillColor: fillColor,
            fillOpacity: 0.7
          })
          .bindPopup(area.disasterType)
          .openPopup()
          .addTo(this.map)
          this.affectedAreasCircle.push(circle)
        }
      }
    })
  }

  private deleteAllAffectedAreas(): void {
    this.affectedAreasData = []
    for (let circle of this.affectedAreasCircle)
      circle.remove()
    this.affectedAreasCircle = []
  }

  private showAllRefugeeCamps(): void {
    this.campService.getAllRefugeeCamps()
    .subscribe({
      next: (data: APIResponse) => this.refugeeCampsData = data.message,
      error: (errorData: any) => console.error(errorData.error.message),
      complete: () => {
        for (let camp of this.refugeeCampsData)
        {
          let marker: Leaflet.Marker = Leaflet.marker([camp.latitude, camp.longitude], {
            icon: this.icons.get('refugeeCamp'),
            draggable: false
          })
          .on('click', (event: Leaflet.LeafletMouseEvent) => {
            this.showRoute(
              this.userLocationMarker.getLatLng(),
              Leaflet.latLng(camp.latitude, camp.longitude)
            )
          })
          .bindPopup(`Camp location ${camp.latitude}, ${camp.longitude}`)
          .addTo(this.map)
          this.refugeeCampsMarker.push(marker)
        }
      }
    })
  }

  private deleteAllRefugeeCamps(): void {
    this.refugeeCampsData = []
    for (let marker of this.refugeeCampsMarker)
      marker.remove()
    this.refugeeCampsMarker = []
  }

  private showRoute(from: Leaflet.LatLng, to: Leaflet.LatLng): void {
    if (!this.userLocationMarker)
      return
    (Leaflet.Routing.osrmv1() as any).route([
    Leaflet.Routing.waypoint(from),
    Leaflet.Routing.waypoint(to)
    ], (error: any, routes: any) => {
      if (error)
      {
        console.log(error)
        return
      }
      if (this.routeLayer)
        this.routeLayer.remove()
      this.routeLayer = Leaflet.Routing
      .line(routes[0])
      .addTo(this.map)
    })
  }
}
