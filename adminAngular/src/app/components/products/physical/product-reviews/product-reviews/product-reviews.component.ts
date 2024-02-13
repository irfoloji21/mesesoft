import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.scss']
})
export class ProductReviewsComponent implements OnInit {

  public product_list: any = [];
  public comments: any = [];
  public loading: boolean = true;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
  ){}

  ngOnInit(): void {
    this.productList();
  }

  productList() {
    this.authService.loadShop().subscribe(
      (shop) => {
        if (shop) {
          const id = shop.seller._id
          this.productService.getShopProduct(id).subscribe(
            (response) => {
              this.product_list = response.products;

              this.comments = [];

              if (Array.isArray(this.product_list) && this.product_list.length > 0) {
                for (const product of this.product_list) {
                  if (Array.isArray(product.reviews) && product.reviews.length > 0) {
                    const ProductsWithComments = product.reviews.filter(review => review);
                    if (ProductsWithComments.length > 0) {
                      ProductsWithComments.forEach(review => {
                        this.comments.push(review);  
                      });
                    }
                  }
                }
              }
              this.loading = false;
            },
          );
        }
      }
    );
  }

  toggleComment(product: any) {
    product.showFullComment = !product.showFullComment;
  }
  
}
