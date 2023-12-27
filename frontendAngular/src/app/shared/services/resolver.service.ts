import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Product } from '../classes/product';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class Resolver {

  public product: Product = {};

  constructor(
    private router: Router,
    public productService: ProductService
  ) { }

  // Resolver
  // Resolver
  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return new Promise((resolve, reject) => {
      this.productService.getProductBySlug(route.params.slug).subscribe(product => {
        if (!product) { // When product is empty redirect 404
          this.router.navigateByUrl('/404', { skipLocationChange: true });
          reject('Ürün bulunamadı');
        } else {
          this.product = product;
          resolve(this.product);
        }
      });
    });
  }

}