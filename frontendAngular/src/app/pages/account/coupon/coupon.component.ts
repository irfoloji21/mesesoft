import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CouponService } from 'src/app/shared/services/coupon.service';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent {

  coupons: any[] = [];

  constructor(private authService: AuthService, private couponService: CouponService) {}

  ngOnInit(): void {
    this.getCouponss();
   
  }

  
  getCouponss(){
        this.authService.loadUser().subscribe(res => {
          for(let a= 0 ; a < res.user.coupons.length ; a++ ) {
            this.couponService.getCouponById(res.user.coupons[a].couponID).subscribe(res=> {
              this.coupons[a] = res.couponCode;
               console.log(this.coupons[a], "İrfanMese")
              })
          }
        })
      }




    }
