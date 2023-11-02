import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CouponCode } from '../classes/coupon';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  private baseUrl = 'http://localhost:8000/api/v2'; 

  constructor(private http: HttpClient) {}

  createCouponCode(couponData: any): Observable<CouponCode> {
    return this.http.post<CouponCode>(`${this.baseUrl}/create-coupon-code`, couponData);
  }

  getCouponsByShopId(shopId: string): Observable<CouponCode> {
    return this.http.get<CouponCode>(`${this.baseUrl}/get-coupon/${shopId}`);
  }

  deleteCoupon(couponId: string): Observable<CouponCode> {
    return this.http.delete<CouponCode>(`${this.baseUrl}/delete-coupon/${couponId}`);
  }

  getCouponValueByName(couponName: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-coupon-value/${couponName}`);
  }
}

