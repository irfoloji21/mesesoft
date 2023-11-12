import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent {

  coupons: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserAddresses();
  }
  
  loadUserAddresses() {
    this.authService.loadUser().subscribe(
      (res) => {
        this.coupons = res.user.coupons;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
