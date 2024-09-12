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
}
