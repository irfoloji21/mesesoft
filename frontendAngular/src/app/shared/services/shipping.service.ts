import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  private apiUrl = 'assets/data/shipping.json'; // JSON dosyasının yolu
    
  constructor(private http: HttpClient) { }

  getShipData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  setSelectedShipping(shipping: any) {
    if (shipping && Object.keys(shipping).length !== 0) {
      localStorage.setItem('selectedShipping', JSON.stringify(shipping));
    } else {
      localStorage.removeItem('selectedShipping'); // ya da varsayılan bir değer atanabilir
    }
  }
}
