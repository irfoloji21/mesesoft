import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/v2';

  constructor(private http: HttpClient) { }


  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/get-all-users`);
  }

}
