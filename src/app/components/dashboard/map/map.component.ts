import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private userLocation!: { lat: number, lon: number }; // Store user's location

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Initialize the map without default zoom controls
    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 13,
      zoomControl: false
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add the zoom control manually and position it
    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);

    // Attempt to get user location
    this.getUserLocation();
  }

  private getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.userLocation = { lat, lon }; // Store the user's current location

          this.map.setView([lat, lon], 13);

          const customIcon = L.icon({
            iconUrl: 'assets/location-marker.png',
            iconSize: [32, 32],
            iconAnchor: [16, 45],
            popupAnchor: [0, -32]
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

  // Search function
  onSearch(event: any): void {
    const query = event.target.value;
    if (query.length > 3) {
      this.searchLocations(query);
    }
  }

  // Function to search for places
  private searchLocations(query: string): void {
    // Make sure the search is close to the user's current location
    if (!this.userLocation) {
      console.error('User location is not available yet');
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5&viewbox=${this.userLocation.lon-0.1},${this.userLocation.lat+0.1},${this.userLocation.lon+0.1},${this.userLocation.lat-0.1}&bounded=1`;

    this.http.get<any[]>(url).subscribe((results) => {
      // Clear old markers
      this.clearMarkers();
      const customIcon = L.icon({
        iconUrl: 'assets/location-marker.png',
        iconSize: [32, 32],
        iconAnchor: [16, 45],
        popupAnchor: [0, -32]
      });

      results.forEach((result) => {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        const marker = L.marker([lat, lon], { icon: customIcon }).addTo(this.map);
        marker.bindPopup(`<b>${result.display_name}</b>`).openPopup();

        this.markers.push(marker);
      });

      if (results.length) {
        this.map.setView([results[0].lat, results[0].lon], 14);
      }
    });
  }

  private clearMarkers(): void {
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
  }
}
