import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../api-response/api-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseString: string = 'http://localhost:5000'
  constructor(private http: HttpClient) { }

  public postLogin(username: string, password: string): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.baseString}/login/admin`, {
        'username': username,
        'password': password
      }
    )
  }
}
