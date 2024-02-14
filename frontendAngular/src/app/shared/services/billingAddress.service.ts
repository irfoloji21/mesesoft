import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BillingAddressService {

  private apiUrl = 'assets/data/billingAdress.json'; 

  constructor(private http: HttpClient) { }

  getBillingAddressData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  setSelectedBillingAddress(billingAddress: any) {
    if (billingAddress && Object.keys(billingAddress).length !== 0) {
      localStorage.setItem('selectedBillingAddress', JSON.stringify(billingAddress));
    } else {
      localStorage.removeItem('selectedBillingAddress'); 
    }
  }
}
