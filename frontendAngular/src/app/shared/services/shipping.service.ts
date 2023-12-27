import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ShippingService {
  selectedShipping: any;
  private apiUrl = 'assets/data/shipping.json'; // JSON dosyasının yolu

  constructor(private http: HttpClient) { }

  getShipData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  setSelectedShipping(shipping: any) {
    this.selectedShipping = shipping;
  }

  getSelectedShipping() {
    return this.selectedShipping;
  }
}
