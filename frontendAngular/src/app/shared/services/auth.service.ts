import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/v2'; 
  private userId: string | null = null;
  private user: any;
  isLoggedIn: boolean = false;
  constructor(private http: HttpClient) { }



  login(email: string, password: string): Observable<any> {
    const body = { email, password };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<any>(`${this.apiUrl}/user/login-user`, body, { headers, withCredentials: true })
    .pipe(tap(user =>{
       this.user = user
       this.isLoggedIn = true;
      }));
  }

  

  register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    const body = { firstName, lastName, email, password };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<any>(`${this.apiUrl}/user/register-user`, body, { headers, withCredentials: true })
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





}
