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
      this.totalAmount = total;
    });
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

