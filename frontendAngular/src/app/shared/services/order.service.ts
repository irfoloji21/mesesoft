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
  public createOrder(product: any, details: any, orderId: any, amount: any, customerEmail: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    var item = {
      shippingDetails: details,
      product: product,
      orderId: orderId,
      amount: amount,
      customerEmail: customerEmail 
    };
  
    state.checkoutItems = item;
    localStorage.setItem("checkoutItems", JSON.stringify(item));
    localStorage.removeItem("cartItems");
  
    this.http.post(`${this.apiUrl}/payment/process`, item, { headers, withCredentials: true }).subscribe(
      (response) => {
        console.log(response, "checkout");
        this.router.navigate(['/shop/checkout/success', orderId]);
      },
      (error) => {
        console.error("Error while posting order data to the backend:", error);
      }
    );
  }
  
   
  
}
  

