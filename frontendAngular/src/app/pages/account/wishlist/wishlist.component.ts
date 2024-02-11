import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/shared/classes/product';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})

export class WishlistComponent implements OnInit {

  public products: Product[] = [];
  public loading: boolean = true;

  constructor(
    private router: Router,
    public productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loadWishlist();
  }

  async loadWishlist() {
    this.loading = true;

    this.productService.wishlistItems.subscribe(response => {
      this.products = response;
      this.loading = false;
    });
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
}
