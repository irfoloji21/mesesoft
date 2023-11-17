import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Koleksiyon modelinize uygun yol

@Injectable({
  providedIn: 'root'
})
export class KoleksiyonService {
    public apiUrl = "http://localhost:8000/api/v2"

  constructor(private http: HttpClient) { }

  getKoleksiyons(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/koleksiyon/koleksiyons`);
  }
}
