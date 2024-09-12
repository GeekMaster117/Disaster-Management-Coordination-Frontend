import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapDataService {
  private pickModeSubject = new BehaviorSubject<{ isActive: boolean, type: string | null }>({ isActive: false, type: null });
  private coordinatesSubject = new BehaviorSubject<{ lat: number, lng: number } | null>(null);

  constructor() { }

  setPickMode(isActive: boolean, type: string | null): void {
    this.pickModeSubject.next({ isActive, type });
  }

  getPickMode(): Observable<{ isActive: boolean, type: string | null }> {
    return this.pickModeSubject.asObservable();
  }

  setCoordinates(lat: number, lng: number): void {
    this.coordinatesSubject.next({ lat, lng });
  }

  getCoordinates(): Observable<{ lat: number, lng: number } | null> {
    return this.coordinatesSubject.asObservable();
  }
}