import { Component } from '@angular/core';
import { Router } from 'express';
import { AuthService } from 'src/app/shared/service/auth.service';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-productss',
  templateUrl: './productss.component.html',
  styleUrls: ['./productss.component.scss']
})
export class ProductssComponent {
  public product_list = []

  constructor(
    private productService: ProductService,
    private authService: AuthService,
  ) { }

  toggleSelection(product: any) {
    product.selected = !product.selected;
  }
  

  // deleteProduct(id) {
  //   this.productService.deleteProduct(id).subscribe(
  //     (response) => {
  //       this.ngOnInit()
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  // editProduct(id) {
  //   console.log(id)
  //   this.router.navigate(['/products/physical/edit-product', id]);
  // }

  // detailProduct(id) {
  //   console.log(id)
  //   this.router.navigate(['/products/physical/product-detail', id]);
  // }

  ngOnInit() {
    this.authService.loadShop().subscribe(
      (shop) => {
        console.log("ENVER1," ,  shop)
        if (shop) {
          const id = shop.seller._id
          this.productService.getShopProduct(id).subscribe(
            (response) => {
              this.product_list = response.products
              console.log(this.product_list , "ENVER2");
              
            },
            (error) => {
              console.error(error);
            }
          );
        }
      },
      (error) => {
        console.error('Kullanıcı kimliği belirleme hatası:', error);
      }
    );
  }

}
