import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = 'http://localhost:8000/api/v2';
  private userId: string | null = null;
  private user: any;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private usedCoupons: Set<string> = new Set();

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
    return this.http.post<any>(`${this.apiUrl}/user/login-user`, body, { headers, withCredentials: true })
      .pipe(tap(user => {
        if (user.success) {
          localStorage.setItem('isLoggedIn', 'true');
          this.isLoggedInSubject.next(true);
          const userCoupon = user.coupon;

          if (userCoupon && !this.usedCoupons.has(userCoupon)) {
            this.usedCoupons.add(userCoupon);
          } else {
          }
        } else {
          this.isLoggedInSubject.next(false);
        }
      }));
  }

  updateUserAddress(userId: string, addressData: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<any>(
      `${this.apiUrl}/user/update-user-addresses/${userId}`,
      addressData,
      { headers, withCredentials: true }
    );
  }

  deleteUserAddress(addressId: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete<any>(`${this.apiUrl}/user/delete-user-address/${addressId}`, { headers, withCredentials: true });
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
  }

  getUserId(): string | null {
    return this.userId;
  }

  loadUser(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<any>(`${this.apiUrl}/user/getuser`, { headers, withCredentials: true });
  }

  async initUser(): Promise<void> {
    try {
      const response = await this.loadUser().toPromise();
      this.user = response.user;
      return this.user;
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenirken hata oluştu:', error);
    }
  }

  setUser(user: any): void {
    this.user = user;
  }

  getUser(): any {
    return this.user;
  }

  activateUser(activation_token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/activation`, { activation_token });
  }

  updateUserPassword(oldPassword: string, newPassword: string, confirmPassword: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(`${this.apiUrl}/user/update-user-password`, { oldPassword, newPassword, confirmPassword }, { headers, withCredentials: true });
  }

  updateUser(userInfo: any,): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<any>(`${this.apiUrl}/user/update-user-info`, userInfo, { headers, withCredentials: true });
  }
}



