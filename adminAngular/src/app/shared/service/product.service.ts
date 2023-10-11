import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api/v2'; // apiUrl burada tanımlandı

  constructor(private http: HttpClient) { }

  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/product/create-product`, productData);
  }
}
