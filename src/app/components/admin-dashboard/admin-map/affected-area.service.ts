import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../../../response/api.response';
import { baseString } from '../../../../urls/basestring.url';

@Injectable({
  providedIn: 'root'
})
export class AffectedAreaService {
  public constructor(private http: HttpClient) { }

  public getAllAffectedArea(): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${baseString}/affectedarea`)
  }

  public deleteAffectedArea(id: number): Observable<APIResponse> {
    return this.http.delete<APIResponse>(`${baseString}/affectedarea/${id}`)
  }

  public addAffectedArea(latitude: number, longitude: number, radius: number, severity: number, disasterType: string): Observable<APIResponse> {
    return this.http.post<APIResponse>(`${baseString}/affectedarea`, {
      'latitude': latitude,
      'longitude': longitude,
      'radius': radius,
      'severity': severity,
      'disasterType': disasterType
    })
  }
}
