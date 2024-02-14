import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

const state = {
  checkoutItems: JSON.parse(localStorage['checkoutItems'] || '[]')
}

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  selectedAddress: any;
  public apiUrl = "http://localhost:8000/api/v2"

  constructor(private router: Router, private http: HttpClient) { }

  // Get Checkout Items
  public get checkoutItems(): Observable<any> {
    const itemsStream = new Observable(observer => {
      observer.next(state.checkoutItems);
      observer.complete();
    });
    return <Observable<any>>itemsStream;
  }

  public createOrder(
    product: any,
    details: any,
    orderId: any,
    amount: any,
    selectedAddress: any,
    selectedCargo: any
  ): Observable<any> {

    if (orderId) {
      var item = {
        shippingDetails: details,
        product: product,
        orderId: orderId,
        totalAmount: amount,
        address: selectedAddress,
        cargo: selectedCargo,
      };

      state.checkoutItems = item;

      localStorage.setItem('checkoutItems', JSON.stringify(item));
      localStorage.removeItem('cartItems');

      this.router.navigate(['/order/success', orderId]);

      return new Observable((observer) => {
        observer.next({ message: 'Ödeme başarılı' });
        observer.complete();
      });

    } else {
      console.error("orderId geçerli bir değere sahip değil.");
    }
  }

  public getOrders(userId: string): Observable<any> {
    const url = `${this.apiUrl}/order/get-all-orders/${userId}`;
    return this.http.get(url);
  }

  public getOrderDetails(orderId: string): Observable<any> {
    const url = `${this.apiUrl}/order/order-details/${orderId}`;
    return this.http.get(url);
  }

  public refundOrder(orderId: string): Observable<any> {
    const refundData = { status: 'Refund Success' };
    return this.http.put<any>(`${this.apiUrl}/order/order-refund-success/${orderId}`, refundData);
  }

  setSelectedAddress(address: any) {
    this.selectedAddress = address;
  }

  getSelectedAddress() {
    return this.selectedAddress;
  }

}
