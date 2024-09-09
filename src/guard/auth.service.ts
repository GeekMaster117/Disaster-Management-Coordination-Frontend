import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../response/api.response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseString: string = 'http://localhost:5000'
  public constructor(private httpClient: HttpClient) { }

  public getValidateToken(token: string): Observable<APIResponse> {
    return this.httpClient.get<APIResponse>(`${this.baseString}/validate`)
  }
}
