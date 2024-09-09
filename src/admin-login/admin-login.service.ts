import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../response/api.response';
import { baseString } from '../urls/basestring.url';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }

  public postLogin(username: string, password: string): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${baseString}/login/admin`, {
        'username': username,
        'password': password
      }
    )
  }
}
