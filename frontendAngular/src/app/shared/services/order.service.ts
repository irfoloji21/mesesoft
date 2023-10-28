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

  // Create order
  public createOrder(paymentData: {product: any ,  amount:any }): Observable<any> {
    return new Observable((observer) => {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');

  
      state.checkoutItems = paymentData;
      localStorage.setItem("checkoutItems", JSON.stringify(paymentData));
      localStorage.removeItem("cartItems");
  
      this.http.post(`${this.apiUrl}/payment/process`, paymentData, { headers, withCredentials: true }).subscribe(
        (response) => {
          console.log(response, "checkoutCart");
          this.router.navigate(['/shop/checkout/success']);
          observer.next(response);
          observer.complete();
        },
        (error) => {
          console.error("Error while posting order data to the backend:", error);
          observer.error(error);
        }
      );
    });
  }
  
  

  
  setSelectedAddress(address: any) {
    this.selectedAddress = address;
  }
  
  getSelectedAddress() {
    return this.selectedAddress;
  }

}
  

