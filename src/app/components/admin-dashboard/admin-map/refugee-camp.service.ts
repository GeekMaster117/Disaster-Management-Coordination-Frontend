import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../../../response/api.response';
import { baseString } from '../../../../urls/basestring.url';

@Injectable({
  providedIn: 'root'
})
export class RefugeeCampService {
  public constructor(private http: HttpClient) { }

  public getAllRefugeeCamps(): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${baseString}/refugeecamp`);
  }

  public deleteRefugeeCamp(id: number): Observable<APIResponse> {
    return this.http.delete<APIResponse>(`${baseString}/refugeecamp/${id}`)
  }

  public updateRefugeeCamp(campId: number,latitude: number, longitude: number): Observable<APIResponse> {
    return this.http.put<APIResponse>(`${baseString}/refugeecamp`, {
      'campId' : campId,
      'latitude': latitude,
      'longitude': longitude
    })
  }
}

