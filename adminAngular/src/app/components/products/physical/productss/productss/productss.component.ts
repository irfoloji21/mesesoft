import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { ProductService } from 'src/app/shared/service/product.service';
import { Image } from '@ks89/angular-modal-gallery';
import {  Product } from 'src/app/shared/tables/product';
import {  DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-productss',
  templateUrl: './productss.component.html',
  styleUrls: ['./productss.component.scss']
})
export class ProductssComponent {
  public closeResult: string;
  public counter: number = 1;
  currentRate = 8;
  productId: string;
  productDetail: Product;
  productImages: any[] = [];
  imagesRect: Image[] = [
    new Image(0, { img: 'assets/images/furniture/6.jpg'}),
  ]
  public product_list = []
  public isModalOpen: boolean = false;
  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  toggleSelection(product: any) {
    product.selected = !product.selected;
  }
  closeModal() {
    this.isModalOpen = false;
  }

  openModal() {
    this.isModalOpen = true;
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

  editProduct(id) {
    console.log(id)
    this.router.navigate(['/products/physical/edit-product', id]);
  }

  detailProduct(product: Product): void {
    this.productDetail = product;
    this.productImages = product.images;
    this.imagesRect = this.productImages.map((image, index) => {
      return new Image(index, { img: image.url }, { img: image.url });
    });

    this.openModal();
  }
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
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

  // actions
  selectedAction: string = '';

  onActionChange(event: any) {
    this.selectedAction = event.target.value;
  }

  
}
