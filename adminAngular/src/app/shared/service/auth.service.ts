import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/v2';
  private shop: any;
  private userId: string | null = null;
  private user: any;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedInSubject.next(isLoggedIn);
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('isLoggedIn', this.isLoggedInSubject.value ? 'true' : 'false');
    });
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}/shop/login-shop`, body, { headers, withCredentials: true })
      .pipe(tap(shop => {
        console.log('Login Response:', shop);
        console.log('routerYOL'); 
        if (shop.success) {
          localStorage.setItem('isLoggedIn', 'true');
          this.isLoggedInSubject.next(true);
          console.log('isLoggedIn', 'true')
        } else {
          localStorage.setItem('isLoggedIn', 'false');
          console.log('isLoggedIn', 'false')
          this.isLoggedInSubject.next(false);
        }
      }
      )
      );
  }


  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
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

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedInSubject.next(false);
    this.user = null;
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    const data = { firstName, lastName, email, password };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}/user/create-user`, data, { headers, withCredentials: true })
      .pipe(tap(user => this.user = user));
  }

  setUserId(userId: string) {
    this.userId = userId;
    console.log("user id setUserId", userId);
  }

  getUserId(): string | null {
    console.log("user id getUserId", this.userId);
    return this.userId;
  }

  setShop(shop: any): void {
    this.shop = shop;
  }

  getShop(): any {
    return this.shop;
  }
}
