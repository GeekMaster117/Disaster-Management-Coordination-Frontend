import { Component, OnInit } from "@angular/core";
import * as Leaflet from 'leaflet'
import 'leaflet-routing-machine'
import { AffectedAreaService } from "./affected-area.service";
import * as SignalR from '@microsoft/signalr'
import { APIResponse } from "../../../../response/api.response";
import { baseString } from "../../../../urls/basestring.url";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map: Leaflet.Map = null!
  private defaultLocation: Leaflet.LatLng = new Leaflet.LatLng(8.5241, 76.9366)
  private defaultZoom: number = 14
  private icons: Map<string, Leaflet.Icon> = new Map<string, Leaflet.Icon>
  private followUser: boolean = true
  private userLocationMarker: Leaflet.Marker = Leaflet.marker(this.defaultLocation)
  private connection: SignalR.HubConnection = null!
  private affectedAreasData: any[] = []
  private affectedAreasCircle: Leaflet.Circle[] = []

  public constructor(private service: AffectedAreaService) {}

  public ngOnInit(): void {
    this.addIcons()

    this.connection = new SignalR.HubConnectionBuilder()
    .withUrl(`${baseString}/notificationhub`)
    .build()
    this.connection
    .start()
    .catch(err => console.error('Error while starting SignalR connection: ' + err));

    this.showAllAffectedAreas()
    this.connection.on('DataUpdated', () => {
      this.deleteAllAffectedAreas()
      this.showAllAffectedAreas()
    })

    this.map = Leaflet.map('map').setView(this.defaultLocation, this.defaultZoom)

    setInterval(() => {
      this.getCurrentLocation()
      .then((location: Leaflet.LatLng) => {
          if (location.distanceTo(this.userLocationMarker.getLatLng()) <= 10)
              return

          this.userLocationMarker.remove()

          this.userLocationMarker = Leaflet.marker(location, {
              icon: this.icons.get('userLocation'),
              draggable: false
          })
          .addTo(this.map)
          .bindPopup(`Your location\n${location.lat}, ${location.lng}`)

          if (this.followUser)
              this.map.panTo(location)
      })
      .catch((error: any) => console.log(error))
    }
    , 500)

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
  }

  private addIcons(): void {
    const userLocationIcon: Leaflet.Icon = Leaflet.icon({
        iconUrl: 'assets/location-marker.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
    this.icons.set('userLocation', userLocationIcon)
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
    this.service.getAllAffectedArea()
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
}
