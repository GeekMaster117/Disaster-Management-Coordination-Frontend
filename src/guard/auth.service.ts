import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../response/api.response';
import { baseString } from '../urls/basestring.url';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public constructor(private httpClient: HttpClient) { }

  public getValidateToken(): Observable<APIResponse> {
    return this.httpClient.get<APIResponse>(`${baseString}/validate`)
  }
}
