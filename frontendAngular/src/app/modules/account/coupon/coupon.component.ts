import { Component, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CouponService } from 'src/app/shared/services/coupon.service';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-coupon",
  templateUrl: "./coupon.component.html",
  styleUrls: ["./coupon.component.scss"],
})

export class CouponComponent implements OnDestroy {
  coupons: any = [];
  public active = 1;
  isModalOpen: boolean = false;
  selectedCoupon: any;
  public loading: boolean = true;
  private userSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private couponService: CouponService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadUserCoupons();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async loadUserCoupons() {
    try {
      this.loading = true;
  
      this.userSubscription = this.authService.loadUser().subscribe(async res => {
        for (let a = 0; a < res.user.coupons.length; a++) {
          const couponRes = await this.couponService
            .getCouponById(res.user.coupons[a].couponID)
            .toPromise();
          this.coupons[a] = couponRes.couponCode;
        }
        this.loading = false;
      });
    } catch (error) {
      console.error(error);
      this.loading = false;
    }
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
