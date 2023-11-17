import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefundService {

  private apiUrl = 'http://localhost:8000/api/v2'; 

  constructor(private http: HttpClient) { }

  updateRefundStatus(id, data): Observable<any> {
    console.log(data, "servise gelen status");
    return this.http.put<any>(`${this.apiUrl}/order/order-refund-success/${id}`, data);

  }

  getShopOrders(id): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/order/get-seller-all-orders/${id}`);
  }
}
