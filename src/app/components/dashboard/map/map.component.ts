import { Component, OnInit } from "@angular/core";
import * as Leaflet from 'leaflet'
import 'leaflet-routing-machine'
import { AffectedAreaService } from "./affected-area.service";
import { APIResponse } from "../../../../response/api.response";

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

  public constructor(private service: AffectedAreaService) {}

  public ngOnInit(): void {
    this.addIcons()
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
    , 10)

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
}
