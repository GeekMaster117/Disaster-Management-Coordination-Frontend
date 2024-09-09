import { Injectable } from '@angular/core';
import { APIResponse } from '../../../response/api.response';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseString } from '../../../urls/basestring.url';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  public constructor(private http: HttpClient) { }

  public postRegister(username: string, firstname: string, lastname: string, password: string): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${baseString}/register/admin`, {
        'username': username,
        'firstname': firstname,
        'lastname': lastname,
        'password': password
      }
    )
  }
}
