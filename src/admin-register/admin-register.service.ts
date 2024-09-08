import { Injectable } from '@angular/core';
import { APIResponse } from '../response/api.response';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private baseString: string = 'http://localhost:5000'
  public constructor(private http: HttpClient) { }

  public postRegister(username: string, firstname: string, lastname: string, password: string, token: string): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.baseString}/register/admin`, {
        'username': username,
        'firstname': firstname,
        'lastname': lastname,
        'password': password
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
  }
}
