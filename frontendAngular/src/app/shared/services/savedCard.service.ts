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

    this.updateSavedCardsFile(updatedCards);

    return of(updatedCards);
  }

  getSavedCards(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  private getSavedCardsSync(): any {
    return JSON.parse(localStorage.getItem('savedCards')) || { cards: [] };
  }

  private updateSavedCardsFile(updatedCards: any): void {
    localStorage.setItem('savedCards', JSON.stringify(updatedCards));
  }

}