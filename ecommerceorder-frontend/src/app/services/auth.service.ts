import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://ecom-app-mm743.eastus.azurecontainer.io:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, { responseType: 'text' });
  }

  logout(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/logout`, {}, { responseType: 'text' as 'json' });
  }
}
