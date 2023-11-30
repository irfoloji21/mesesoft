import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuickViewComponent } from "../../modal/quick-view/quick-view.component";
import { CartModalComponent } from "../../modal/cart-modal/cart-modal.component";
import { Product } from "../../../classes/product";
import { ProductService } from "../../../services/product.service";

@Component({
  selector: 'app-product-box-one',
  templateUrl: './product-box-one.component.html',
  styleUrls: ['./product-box-one.component.scss']
})

export class ProductBoxOneComponent implements OnInit {
  @Input() product: Product;
  @Input() currency: any = this.productService.Currency; // Default Currency 
  @Input() thumbnail: boolean = false; // Default False 
  @Input() onHowerChangeImage: boolean = false; // Default False
  @Input() cartModal: boolean = false; // Default False
  @Input() loader: boolean = false;
  filteredProducts: any = []
  isTopCollection: boolean = false;
  public sortedProducts: any = []
  public ImageSrc: string
  discountPercentages: number[] = [];
  showTopCollection: boolean
  @ViewChild("quickView") QuickView: QuickViewComponent;
  @ViewChild("cartModal") CartModal: CartModalComponent;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    if (this.loader) {
      setTimeout(() => { this.loader = false; }, 2000); // Skeleton Loader
    }
    this.loadData();
    this.topCollection();
  }

  topCollection() {
    this.productService.getProducts.subscribe((products: any) => {
      const productArray = Array.isArray(products.products) ? products.products : [];
      const filteredProductsBest = productArray.filter(product => product.sold_out > 0);
      this.sortedProducts = filteredProductsBest.sort((a, b) => b.sold_out - a.sold_out);
      const topCollectionIds = this.sortedProducts.map(product => product._id);
      this.showTopCollection = productArray.map(product => topCollectionIds.includes(product._id));
      // console.log(this.showTopCollection , "topCollectionIds ençok satan")
    });
    // console.log(this.sortedProducts, "sortedProducts");
  }

  private loadData(): void {
    let productsArray = Array.isArray(this.product) ? this.product : [this.product];
    // console.log(productsArray, "productsArray");

    this.filteredProducts = productsArray
      .filter(product => product.discountPrice > 0)
      .map(product => {
        let discountPercentage = ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100;
        // console.log(discountPercentage, "discountPercentage");
        this.discountPercentages.push(discountPercentage);
        return product._id;
      });
  }

  truncateProductName(name: string, maxLength: number): string {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...';
    }
    return name;
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
    console.log(product, "add to  cart")
  }

  addToWishlist(product: any) {
    this.productService.addToWishlist(product);
  }

  addToCompare(product: any) {
    this.productService.addToCompare(product);
  }

}
