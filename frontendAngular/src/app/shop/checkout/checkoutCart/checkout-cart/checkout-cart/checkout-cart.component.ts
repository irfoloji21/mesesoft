import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { Product } from 'src/app/shared/classes/product';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CouponService } from 'src/app/shared/services/coupon.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-checkout-cart',
  templateUrl: './checkout-cart.component.html',
  styleUrls: ['./checkout-cart.component.scss']
})

export class CheckoutCartComponent {

  appliedCoupon: any;
  user:any;
  subscription: Subscription;
  public products: Product[] = [];
  couponForm: FormGroup;
  showDiscountedTotal: boolean = false;
  discountedTotal: number = 0;
  isCouponValid = false;
  totalAmount: number;
  couponCode: any;
  discount_type;
  discountedTotalType: any;

  constructor(
    public productService: ProductService,
    private fb: FormBuilder,
    private couponService: CouponService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.productService.cartItems.subscribe((response) => {
      this.products = response
      console.log(this.products, "checkoutCart")
    });
    this.couponForm = this.fb.group({
      couponCode: ['']
    });
    this.subscription = this.couponService.appliedCoupon$.subscribe((coupon) => {
      this.appliedCoupon = coupon;
    });
  }

  ngOnInit(): void {
    this.getTotal.subscribe((total) => {
      console.log(total, "totalAmount")
      this.totalAmount = total;
    });

    this.couponService.appliedCoupon$.subscribe((coupon) => {
      if (coupon) {
        console.log(coupon , "CouponShel")
        this.updateDiscountedTotal(coupon);
      }
    });
  }

  // 1 - Kuponun Daha Önce Kullanılıp Kullanılmadığını Kontrol Etme
  // 2 - Kuponun Geçerli Olup Olmadığını Kontrol Etme
  // 3 - Kuponun Tarih Aralığını Kontrol Etme
  // 4 - Minimum Alışveriş Tutarını Kontrol Etme
  // 5 - Kullanıcı ve Kupon Bilgilerini Güncelleme
  // 6 - Kullanıcı ve Kupon Bilgilerini Güncelleme

  applyCoupon() {
    event.preventDefault();
    const user = this.authService.getUser();
    this.couponCode = this.couponForm.get('couponCode').value;
  
    const isCouponAlreadyUsed = user.user.coupons.some(appliedCoupon => appliedCoupon.name === this.couponCode);
    if (isCouponAlreadyUsed) {
      this.toastr.error('Bu kupon daha önce kullanıldı', 'Hata');
      this.isCouponValid = true;
      this.showDiscountedTotal = false;
      this.couponForm.reset();
      return;
    }
  
    const couponCheck$ = this.couponService.getCouponValueByName(this.couponCode).pipe();
  
    couponCheck$.subscribe(
      (response) => {
        if (response && response.couponCode && response.couponCode.name === this.couponCode) {
          const currentDate = new Date();
          const startDate = new Date(response.couponCode.start_date.year, response.couponCode.start_date.month - 1);
          const endDate = new Date(response.couponCode.end_date.year, response.couponCode.end_date.month - 1);
  
          if (currentDate >= startDate && currentDate <= endDate) {
            this.isCouponValid = true;
            this.toastr.success('Kupon kodu başarıyla uygulandı', 'Başarılı');
            this.couponForm.reset();
  
            // Minimum alışveriş tutarı kontrlü
            if (this.totalAmount >= response.couponCode.min) {
              const newAppliedCoupon = {
                couponID: this.couponCode._id,
                name: this.couponCode,
                quantity: response.couponCode.quantity,
              };
  
              user.user.coupons.push(newAppliedCoupon);
              this.authService.updateUser(user);
              this.showDiscountedTotal = true;
  
              if (user.user.quantity > 0) {
                user.user.quantity--;
              }
  
              this.couponService.applyCoupon(response.couponCode);
            } else {
              this.toastr.error(`Minimum alışveriş tutarı ${response.couponCode.min} TL'yi karşılamıyor`, 'Hata');
              this.showDiscountedTotal = false;
  
              if (user.user.quantity > 0) {
                user.user.quantity--;
              }
            }
          } else {
            this.toastr.error('Bu kuponun süresi doldu', 'Hata');
            this.isCouponValid = false;
            this.showDiscountedTotal = false;
  
            if (user.user.quantity > 0) {
              user.user.quantity--;
            }
          }
        } else {
          this.toastr.error('Kupon kodu geçerli değil', 'Hata');
          this.isCouponValid = false;
          this.showDiscountedTotal = false;
  
          if (user.user.quantity > 0) {
            user.user.quantity--;
          }
        }
  
        this.updateDiscountedTotal(response.couponCode);
        this.authService.getUser();
      }
    );
  }
  
  
  

  updateDiscountedTotal(couponCode: any) {
    if (this.isCouponValid && this.totalAmount >= couponCode.min) {
      const discountValue = couponCode.quantity;
      if (couponCode.discount_type === 'percentage') {
        this.discountedTotal = this.totalAmount - (this.totalAmount * discountValue / 100);
        this.discountedTotalType = `%${discountValue}`;
      } else if (couponCode.discount_type === 'fixed') {
        this.discountedTotal = this.totalAmount - discountValue;
        this.discountedTotalType = `-${discountValue}$`;
      }
    } else {
      this.discountedTotal = this.totalAmount;
      this.discountedTotalType = '';
    }
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  increment(product, qty = 1) {
    this.productService.updateCartQuantity(product, qty);
  }

  decrement(product, qty = -1) {
    this.productService.updateCartQuantity(product, qty);
  }

  removeItem(product: any) {
    this.productService.removeCartItem(product);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

