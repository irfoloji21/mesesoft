import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/v2'; 

  constructor(private http: HttpClient) { }

  loginUser(email: string, password: string): Observable<any> {
    const body = { email, password };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<any>(`${this.apiUrl}/user/login-user`, body, { headers, withCredentials: true });
  }
}
