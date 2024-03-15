import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:8000/api/v2";
  private userId: string | null = null;
  private user: any;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private usedCoupons: Set<string> = new Set();

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient , private toast : ToastrService ) {
    // Check if the user is already logged in and update the isLoggedInSubject
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    this.isLoggedInSubject.next(isLoggedIn);
    // Listen for window beforeunload event to persist login status in localStorage
    window.addEventListener("beforeunload", () => {
      localStorage.setItem(
        "isLoggedIn",
        this.isLoggedInSubject.value ? "true" : "false"
      );
    });
  }

  // Login user with provided credentials
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http
      .post<any>(`${this.apiUrl}/user/login-user`, body, {
        headers,
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          if (user.success) {
            // If login is successful, update isLoggedInSubject and persist login status
            localStorage.setItem("isLoggedIn", "true");
            this.isLoggedInSubject.next(true);
            // Add user's coupon to used coupons set if it's not already added
            const userCoupon = user.coupon;
            if (userCoupon && !this.usedCoupons.has(userCoupon)) {
              this.usedCoupons.add(userCoupon);
            }
          } else {
            // If login is unsuccessful, update isLoggedInSubject
            this.isLoggedInSubject.next(false);
            this.toast.error('error')
            
          }
        })
      );
  }

  // Update user's address with provided data
  updateUserAddress(userId: string, addressData: any): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.put<any>(
      `${this.apiUrl}/user/update-user-addresses/${userId}`,
      addressData,
      { headers, withCredentials: true }
    );
  }

  // Delete user's address with provided addressId
  deleteUserAddress(addressId: string): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.delete<any>(
      `${this.apiUrl}/user/delete-user-address/${addressId}`,
      { headers, withCredentials: true }
    );
  }

  // Logout the user by removing login status from localStorage and updating isLoggedInSubject
  logout(): void {
    localStorage.removeItem("isLoggedIn");
    this.isLoggedInSubject.next(false);
    this.user = null;
  }

  // Register a new user with provided data
  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Observable<any> {
    const data = { firstName, lastName, email, password };
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http
      .post<any>(`${this.apiUrl}/user/create-user`, data, {
        headers,
        withCredentials: true,
      })
      .pipe(tap((user) => (this.user = user)));
  }

  // Set the userId
  setUserId(userId: string): void {
    this.userId = userId;
  }

  // Get the userId
  getUserId(): string | null {
    return this.userId;
  }

  // Load user data from the server
  loadUser(): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.get<any>(`${this.apiUrl}/user/getuser`, {
      headers,
      withCredentials: true,
    });
  }

  // Asynchronously initialize user data
  async initUser(): Promise<void> {
    try {
      const response = await this.loadUser().toPromise();
      this.user = response.user;
      return this.user;
    } catch (error) {
      console.error("Error occurred while loading user information:", error);
    }
  }

  // Set user data
  setUser(user: any): void {
    this.user = user;
  }

  // Get user data
  getUser(): any {
    return this.user;
  }

  // Activate user account with activation token
  activateUser(activation_token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/activation`, {
      activation_token,
    });
  }

  // Update user's password
  updateUserPassword(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.put(
      `${this.apiUrl}/user/update-user-password`,
      { oldPassword, newPassword, confirmPassword },
      { headers, withCredentials: true }
    );
  }

  // Update user's information
  updateUser(userInfo: any): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.put<any>(
      `${this.apiUrl}/user/update-user-info`,
      userInfo,
      { headers, withCredentials: true }
    );
  }
}
