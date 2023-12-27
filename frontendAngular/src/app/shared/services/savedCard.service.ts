
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SavedCardService {
  private apiUrl = 'assets/data/savedCard.json';

  constructor(private http: HttpClient) { }

  addNewCard(newCard: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addNewCard`, newCard);
  }

  getSavedCards(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
