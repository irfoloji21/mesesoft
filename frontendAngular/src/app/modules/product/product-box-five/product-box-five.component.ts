import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Product } from 'src/app/shared/classes/product';
import { CartModalComponent } from 'src/app/shared/components/modal/cart-modal/cart-modal.component';
import { QuickViewComponent } from 'src/app/shared/components/modal/quick-view/quick-view.component';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-product-box-five',
  templateUrl: './product-box-five.component.html',
  styleUrls: ['./product-box-five.component.scss']
})
export class ProductBoxFiveComponent implements OnInit {

  @Input() product: Product;
  @Input() currency: any = this.productService.Currency; // Default Currency 
  @Input() thumbnail: boolean = false; // Default False 
  @Input() onHowerChangeImage: boolean = false; // Default False
  @Input() cartModal: boolean = false; // Default False

  @ViewChild("quickView") QuickView: QuickViewComponent;
  @ViewChild("cartModal") CartModal: CartModalComponent;

  public ImageSrc: string

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
  }

  // Get Product Color
  Color(variants) {
    const uniqColor = [];
    for (let i = 0; i < Object.keys(variants).length; i++) {
      if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
        uniqColor.push(variants[i].color)
      }
    }
    return uniqColor
  }

  // Change Variants
  ChangeVariants(color, product) {
    product.variants.map((item) => {
      if (item.color === color) {
        product.images.map((img) => {
          if (img.image_id === item.image_id) {
            this.ImageSrc = img.src;
          }
        })
      }
    })
  }

  // Change Variants Image
  ChangeVariantsImage(src) {
    this.ImageSrc = src;
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
