import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from "../../shared/services/product.service";
import { Product } from "../../shared/classes/product";
import { FormBuilder, FormGroup } from '@angular/forms';
import { CouponService } from 'src/app/shared/services/coupon.service';
import { CouponCode } from 'src/app/shared/classes/coupon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  public products: Product[] = [];
  couponForm: FormGroup;
  showDiscountedTotal: boolean = false;
  discountedTotal = 0;
  isCouponValid = false;
  totalAmount: number; 
  couponCode: string; 
  discount_type;
  discountedTotalType: any;

  constructor(
    public productService: ProductService,
    private fb: FormBuilder,
    private couponService: CouponService,
    private toastr: ToastrService
  ) {
    this.productService.cartItems.subscribe((response) => (this.products = response));
    this.couponForm = this.fb.group({
      couponCode: ['']
    });
  }

  ngOnInit(): void {
    this.getTotal.subscribe((total) => {
      console.log(total , "totalAmount")
      this.totalAmount = total;

    });
    this.couponService.appliedCoupon$.subscribe((coupon) => {
      if (coupon) {
        this.updateDiscountedTotal(coupon);
      }
    });
  }

  applyCoupon() {
    event.preventDefault();
    this.couponCode = this.couponForm.get('couponCode').value;
    this.couponService.getCouponValueByName(this.couponCode).subscribe((response) => {
      console.log(response, "kupon");
      if (response && response.couponCode && response.couponCode.name === this.couponCode && response.couponCode.start_date && response.couponCode.end_date) {
        const currentDate = new Date(); 
        console.log(currentDate, "şuanki date");
        const startDate = new Date(response.couponCode.start_date.year, response.couponCode.start_date.month - 1);
        const endDate = new Date(response.couponCode.end_date.year, response.couponCode.end_date.month - 1);
  
        if (currentDate >= startDate && currentDate <= endDate) {
          this.isCouponValid = true;
          this.showDiscountedTotal = true;
          this.toastr.success('Kupon kodu başarıyla uygulandı', 'Başarılı');
          this.couponForm.reset();
  
          if (this.totalAmount >= response.couponCode.min) {

            const appliedCoupon = {
              code: this.couponCode,
              discount: response.couponCode.quantity,
            };
            localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
            this.couponService.applyCoupon(response.couponCode);
            this.updateDiscountedTotal(response.couponCode);
          } else {
            this.toastr.error('Minimum alışveriş tutarı gerekliliği karşılanmıyor', 'Hata');
            this.isCouponValid = false;
            this.showDiscountedTotal = false;
            this.discountedTotal = this.totalAmount;
            this.couponForm.reset();
          }
        } else {
          this.toastr.error('Bu kuponun süresi doldu', 'Hata');
          this.isCouponValid = false;
          this.showDiscountedTotal = false;
          this.discountedTotal = this.totalAmount;
          this.couponForm.reset();
        }
      } else {
        this.toastr.error('Kupon kodu geçerli değil', 'Hata');
        this.isCouponValid = false;
        this.showDiscountedTotal = false;
        this.discountedTotal = this.totalAmount;
        this.couponForm.reset();
      }
    });
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
}








  // 1-Kuponun Varlığını Kontrol Etme   +++
  // 2-Kupon Kodunun Kullanım Durumunu Kontrol Etme  +++  percentage mi fixed mi?
  // 3-Kupon Kodunun Geçerlilik Süresini Kontrol Etme +++ date kontrolü
  // 4-Minimum alışveriş Tutarı +++
  // 5-İndirim Hesaplama  +++
  // 6-Kupon Kullanımını İşaretleme +++
  // 7-Kullanıcıya İndirimli Fiyatı Gösterme +++
  // 8-usera gönderme */ backendte yok
 