import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  private map!: L.Map;

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [18.504620, 1159.235129],
      zoom: 5
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.getUserLocation();
  }

  private getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          this.map.setView([lat, lon], 13);

          const customIcon = L.icon({
            iconUrl: 'assets/location-marker.png', // Path to your custom marker image
            iconSize: [32, 32], // Size of the icon
            iconAnchor: [16, 45], // Anchor point of the icon (relative to its size)
            popupAnchor: [0, -32] // Popup anchor point (relative to the iconAnchor)
          });

          L.marker([lat, lon], { icon: customIcon }).addTo(this.map)
            .bindPopup('You are here!')
            .openPopup();
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
}
