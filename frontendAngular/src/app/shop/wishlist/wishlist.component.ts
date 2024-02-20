import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from "../../shared/services/product.service";
import { Product } from "../../shared/classes/product";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, OnDestroy {

  public products: Product[] = [];
  private wishlistSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    public productService: ProductService
  ) { }

  ngOnInit(): void {
    this.wishlistSubscription = this.productService.wishlistItems.subscribe(response => this.products = response);
  }

  async addToCart(product: any) {
    const status = await this.productService.addToCart(product);
    if (status) {
      this.router.navigate(['/shop/cart']);
      this.removeItem(product);
    }
  }

  removeItem(product: any) {
    this.productService.removeWishlistItem(product);
  }

  ngOnDestroy(): void {
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }
}