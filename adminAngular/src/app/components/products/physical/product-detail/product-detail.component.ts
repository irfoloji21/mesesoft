import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Image } from '@ks89/angular-modal-gallery';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/shared/service/product.service';
import { Images, Product } from 'src/app/shared/tables/product';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  providers: [NgbRatingConfig]
})

export class ProductDetailComponent implements OnInit {
  public closeResult: string;
  public counter: number = 1;
  currentRate = 8;
  productId: string;
  productDetail: Product;
  createdAt: Date;
  elapsedTime: any = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  productImages: any[] = [];
  imagesRect: Image[] = [
    new Image(0, { img: 'assets/images/furniture/6.jpg'}),
  ]

  constructor(
    private modalService: NgbModal,
    private productService: ProductService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    config: NgbRatingConfig
  ) {
    config.max = 5;
    config.readonly = false;
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  increment() {
    this.counter += 1;
  }

  decrement() {
    this.counter -= 1;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      this.getProductDetails(this.productId);
    });
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getProductDetails(id: string): void {
    this.productService.getProductById(id).subscribe(
      (data) => {
        this.productDetail = data.product;
        this.productImages = this.productDetail.images;
        
        this.imagesRect = this.productImages.map((image, index) => {
          return new Image(index, { img: image.url }, { img: image.url });
        });
        
        const cleanDate = String(this.productDetail.createdAt).split('.')[0];
        this.createdAt = new Date(cleanDate);
      },
      (error) => {
        console.error('Error fetching product details', error);
      }
    );

    setInterval(() => {
      const now = new Date();
      const difference = now.getTime() - this.createdAt.getTime();

      this.elapsedTime.days = Math.floor(difference / (1000 * 60 * 60 * 24));
      this.elapsedTime.hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.elapsedTime.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      this.elapsedTime.seconds = Math.floor((difference % (1000 * 60)) / 1000);
    }, 1000);
  }
}
