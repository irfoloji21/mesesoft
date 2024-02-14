import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  public product_list = []

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) { }

  deleteProduct(id) {
    this.productService.deleteProduct(id).subscribe(
      (response) => {
        this.ngOnInit()
      },
      (error) => {
        console.error(error);
      }
    );
  }

  editProduct(id) {
    this.router.navigate(['/products/catalog/edit-product', id]);
  }

  detailProduct(id) {
    this.router.navigate(['/products/catalog/product-detail', id]);
  }

  ngOnInit() {
    this.authService.loadShop().subscribe(
      (shop) => {
        if (shop) {
          const id = shop.seller._id
          this.productService.getShopProduct(id).subscribe(
            (response) => {
              this.product_list = response.products
              
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
