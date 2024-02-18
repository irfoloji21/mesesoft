import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Product } from 'src/app/shared/classes/product';
import { CartModalComponent } from 'src/app/shared/components/modal/cart-modal/cart-modal.component';
import { QuickViewComponent } from 'src/app/shared/components/modal/quick-view/quick-view.component';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-product-box-three',
  templateUrl: './product-box-three.component.html',
  styleUrls: ['./product-box-three.component.scss']
})
export class ProductBoxThreeComponent implements OnInit {

  @Input() product: Product;
  @Input() currency: any = this.productService.Currency; // Default Currency
  @Input() cartModal: boolean = false; // Default False

  @ViewChild("quickView") QuickView: QuickViewComponent;
  @ViewChild("cartModal") CartModal: CartModalComponent;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
  }

  addToCart(product: any) {
    this.productService.addToCart(product);
  }

  addToWishlist(product: any) {
    this.productService.addToWishlist(product);
  }

  addToCompare(product: any) {
    this.productService.addToCompare(product);
  }

}
