import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ContactService {
  private apiUrl = 'http://localhost:3000/messages';

  constructor(private http: HttpClient) { }

  getMessages(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addMessage(message: any): Observable<any> {
    return this.http.post(this.apiUrl, message);
  }
}
