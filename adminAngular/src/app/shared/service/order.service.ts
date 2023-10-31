import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8000/api/v2'; // apiUrl burada tanımlandı

  constructor(private http: HttpClient) { }


  getShopOrders(id): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/order/get-seller-all-orders/${id}`);
  }

  updateOrderStatus(id, status): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/order/update-order-status/${id}`, status);
  }


 
}
