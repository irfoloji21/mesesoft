import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CouponService } from 'src/app/shared/services/coupon.service';

@Component({
  selector: "app-coupon",
  templateUrl: "./coupon.component.html",
  styleUrls: ["./coupon.component.scss"],
})

export class CouponComponent {
  coupons: any = [];
  public active = 1;
  isModalOpen: boolean = false;
  selectedCoupon: any;

  constructor(
    private authService: AuthService,
    private couponService: CouponService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getCouponss();
    console.log(this.coupons[0].end_date)
  }

  getCouponss() {
    this.authService.loadUser().subscribe((res) => {
      for (let a = 0; a < res.user.coupons.length; a++) {
        this.couponService
          .getCouponById(res.user.coupons[a].couponID)
          .subscribe((res) => {
            console.log(res , "enver1")
            this.coupons[a] = res.couponCode;
          });
          console.log(this.coupons , "enver2")

      }
     });
  }

  openModal(coupon: any) {
    this.isModalOpen = true;
    this.selectedCoupon = coupon;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  copyCouponCode() {
    const couponCode = this.selectedCoupon?.name;
    const textarea = document.createElement("textarea");
    textarea.value = couponCode || "";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    this.toastr.success("The coupon was copied", "Success");
    document.body.removeChild(textarea);

    setTimeout(() => {
      this.closeModal();
    }, 1000);
  }

  getMonthName(monthNumber: number): string {
    const monthNames = [
      'January', 
      'February', 
      'March', 
      'April', 
      'May', 
      'June', 
      'July', 
      'August', 
      'September', 
      'October', 
      'November', 
      'December'
    ];

    const monthName = monthNames[monthNumber - 1];

    return monthName || '';
  }

}
