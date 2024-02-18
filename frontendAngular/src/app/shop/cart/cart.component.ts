import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ProductService } from "../../shared/services/product.service";
import { Product } from "../../shared/classes/product";
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit, OnDestroy {

  public products: Product[] = [];
  couponForm: FormGroup;
  showDiscountedTotal: boolean = false;
  discountedTotal = 0;
  isCouponValid = false;
  totalAmount: number;
  couponCode: string;
  discount_type;
  discountedTotalType: any;
  private cartItemsSubscription: Subscription;
  private cartTotalSubscription: Subscription;

  constructor(
    public productService: ProductService,
    private fb: FormBuilder,
  ) {
    this.cartItemsSubscription = this.productService.cartItems.subscribe((response) => (this.products = response));
    this.couponForm = this.fb.group({
      couponCode: ['']
    });
  }

  ngOnInit(): void {
    this.cartTotalSubscription = this.getTotal.subscribe((total) => {
      this.totalAmount = total;
    });
  }

  ngOnDestroy(): void {
    if (this.cartItemsSubscription) {
      this.cartItemsSubscription.unsubscribe();
    }
    if (this.cartTotalSubscription) {
      this.cartTotalSubscription.unsubscribe();
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