import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.scss']
})
export class ProductReviewsComponent implements OnInit {

  public product_list: any = []
  yorumIcerenUrunler:any = []
  noComments: any;
  comments : any = []
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
              this.product_list = response.products
              console.log(this.product_list);
  
              this.comments = [];
  
              if (Array.isArray(this.product_list) && this.product_list.length > 0) {
                for (const product of this.product_list) {
                  if (Array.isArray(product.reviews) && product.reviews.length > 0) {
                    const yorumIcerenUrunler = product.reviews.filter(review => review);
                    if (yorumIcerenUrunler.length > 0) {
                      yorumIcerenUrunler.forEach(review => {
                        this.comments.push(review);  
                        console.log(review, "reviews");
                        console.log(this.comments , "comments");
                      });
                    }
                  }
                }
              }
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
