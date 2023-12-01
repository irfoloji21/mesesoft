import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CouponCode } from '../classes/coupon';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  private baseUrl = 'http://localhost:8000/api/v2'; 

  constructor(private http: HttpClient) {}

  createCouponCode(couponData: any): Observable<CouponCode> {
    return this.http.post<CouponCode>(`${this.baseUrl}/coupon/create-coupon-code`, couponData);
  }

  getCouponsByShopId(shopId: string): Observable<CouponCode> {
    return this.http.get<CouponCode>(`${this.baseUrl}/coupon/get-coupon/${shopId}`);
  }

  deleteCoupon(couponId: string): Observable<CouponCode> {
    return this.http.delete<CouponCode>(`${this.baseUrl}/coupon/delete-coupon/${couponId}`);
  }
  getCouponById(couponId: string): Observable<CouponCode> {
    return this.http.get<CouponCode>(`${this.baseUrl}/coupon/get-coupon-code/${couponId}`);
  }

  getCouponValueByName(couponName: any): Observable<any> {
    return this.http.get<CouponCode>(`${this.baseUrl}/coupon/get-coupon-value/${couponName}`);
  }
  
  private appliedCouponSubject = new BehaviorSubject<any>(null);
  appliedCoupon$ = this.appliedCouponSubject.asObservable();

  applyCoupon(coupon: any) {
    this.appliedCouponSubject.next(coupon);
  }
}

