import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from "../../shared/services/product.service";
import { Product } from "../../shared/classes/product";
import { FormBuilder, FormGroup } from '@angular/forms';
import { CouponService } from 'src/app/shared/services/coupon.service';
import { CouponCode } from 'src/app/shared/classes/coupon';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public products: Product[] = [];
  couponForm: FormGroup;
  couponCodeVisible: boolean = false;
  showDiscountedTotal: boolean = false;
  discountedTotal  = 100 ;
  constructor(public productService: ProductService , private fb: FormBuilder , private couponService : CouponService) {
    this.productService.cartItems.subscribe(response => this.products = response);
    this.couponForm = this.fb.group({
      couponCode: ['']
    });
  }

  ngOnInit(): void {
    const coupon  = 5; 
    this.couponService.createCouponCode(coupon).subscribe(
      (response) => {
        console.log(response, "Coupon");
      }
    );
    
    
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  // Increament
  increment(product, qty = 1) {
    this.productService.updateCartQuantity(product, qty);
  }

  // Decrement
  decrement(product, qty = -1) {
    this.productService.updateCartQuantity(product, qty);
  }

  public removeItem(product: any) {
    this.productService.removeCartItem(product);
  }


  // 1-Kuponun Varlığını Kontrol Etme
  // 2-Kupon Kodunun Kullanım Durumunu Kontrol Etme
  // 3-Kupon Kodunun Geçerlilik Süresini Kontrol Etme
  // 4-Minimum alışveriş Tutarı
  // 5-İndirim Hesaplama
  // 6-Kupon Kullanımını İşaretleme
  // 7-Kullanıcıya İndirimli Fiyatı Gösterme
 



// markCouponAsUsed(coupon: any): void {
//   if (coupon) {
//     coupon.status = false;
//     this.couponService.getCouponValueByName(coupon).subscribe((response) => {
//       console.log(response , "Coupon")
//     });
//   }
// }


  

}
