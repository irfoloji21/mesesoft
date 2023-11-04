import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  private apiUrl = 'assets/data/faq.json'; // JSON dosyasının yolu
    
  constructor(private http: HttpClient) { }

  getFaqData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
