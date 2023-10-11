import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/v2';
  private shop: any;

  constructor(private http: HttpClient) { }



  loginShop(email: string, password: string): Observable<any> {
    const body = { email, password };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<any>(`${this.apiUrl}/shop/login-shop`, body, { headers, withCredentials: true })
    .pipe(tap(shop => this.shop = shop));
  }



  loadShop(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<any>(`${this.apiUrl}/shop/getSeller`, { headers, withCredentials: true });
  }

  async initShop(): Promise<void> {
    try {
      const response = await this.loadShop().toPromise();
      this.shop = response.shop;
      return this.shop;
    } catch (error) {
      
      console.error('Kullanıcı bilgileri yüklenirken hata oluştu:', error);
    }
  }

  setShop(shop: any): void {
    this.shop = shop;
  }

  getShop(): any {
    return this.shop;
  }
}
