import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private apiUrl = 'http://localhost:8000/api/v2';

  constructor(private http: HttpClient) { }

  
  updateShop(formData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/shop/update-seller-info`, formData);
  }
}
