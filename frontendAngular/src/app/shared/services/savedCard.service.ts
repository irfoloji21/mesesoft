import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SavedCardService {
  private apiUrl = 'assets/data/savedCard.json';

  constructor(private http: HttpClient) { }

  addNewCard(newCard: any): Observable<any> {
    const updatedCards = this.getSavedCardsSync();
    updatedCards.cards.push(newCard);

    // Dosyayı güncelle
    this.updateSavedCardsFile(updatedCards);

    // Güncellenmiş kartları döndür
    return of(updatedCards);
    // return this.http.post(`${this.apiUrl}/addNewCard`, newCard);
  }

  getSavedCards(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  private getSavedCardsSync(): any {
    // Senkron bir şekilde kartları al (bu örnek için basit bir senaryo)
    return JSON.parse(localStorage.getItem('savedCards')) || { cards: [] };
  }

  private updateSavedCardsFile(updatedCards: any): void {
    // Dosyayı güncelle (bu örnek için basit bir senaryo)
    localStorage.setItem('savedCards', JSON.stringify(updatedCards));
  }

  // getSavedCards(): Observable<any> {
  //   return this.http.get<any>(this.apiUrl);
  // }
}