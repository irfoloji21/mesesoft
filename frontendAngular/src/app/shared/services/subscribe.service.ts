import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscribeService {
  private apiURL = 'assets/data/subscribe.json';  // Jsonla post isteğii atamıyoruz sadece GET atılıyor RxJs(of) ile simülsyon kullandık

  constructor(private http: HttpClient) { }

  subscribe(email: string): Observable<any> {
    return of({ status: 'success', message: 'Abonelik işlemi başarıyla gerçekleştirildi.' });
  }

}
