import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../../shared/data/slider';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { SizeModalComponent } from "../../../../shared/components/modal/size-modal/size-modal.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-left-sidebar',
  templateUrl: './product-left-sidebar.component.html',
  styleUrls: ['./product-left-sidebar.component.scss']
})
export class ProductLeftSidebarComponent implements OnInit {
 

  public product: Product = {};
  public counter: number = 1;
  public activeSlide: any = 0;
  public selectedSize: any;
  public mobileSidebar: boolean = false;
  public active = 1;
  reviewForm: FormGroup;
  selectedRating: number ;
  comment:any = {}
  @ViewChild("sizeChart") SizeChart: SizeModalComponent;

  public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

  constructor(private route: ActivatedRoute, private router: Router,
    public productService: ProductService , private formBuilder: FormBuilder, private toastr: ToastrService) {
    this.route.data.subscribe(response => {
      this.product = response.data.product;
      console.log("dddd", this.product)

      this.reviewForm = this.formBuilder.group({
        rating: [ null , Validators.required],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        reviewTitle: ['', Validators.required],
        comment: ['', Validators.required],
      });
    });
  }

  ngOnInit(): void { 
    this.submitReview();
   }
   
   submitReview() {
    if (this.reviewForm.valid) {
      console.log('Form Gönderildi:', this.reviewForm.value);
      this.comment = this.reviewForm.value;
      this.productService.createNewReview(this.comment).subscribe({
        next: (response) => {
          console.log('Backend Cevap', response);
          this.toastr.success(' The evaluation was sent successfully', 'Successfully');
        },
        error: (error) => {
          console.error('Backend Hata:', error);
            this.toastr.error('An error occurred while sending the evaluation', 'Error');
        }
      });
      this.reviewForm.reset();
      this.selectedRating = 0;
    }
  }
  
  

  setRating(star: number) {
    if (star === this.selectedRating) {
      this.selectedRating = 0;
    } else {
      this.selectedRating = star;
      this.reviewForm.get('rating').setValue(this.selectedRating); 
    }
    
  }
  
  

  // Get Product Color 
  Color(variants) {
    const uniqColor = []
    for (let i = 0; i < Object.keys(variants).length; i++) {
      if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
        uniqColor.push(variants[i].color)
      }
    }
    return uniqColor
  }

  // Get Product Size
  Size(variants) {
    const uniqSize = []
    for (let i = 0; i < Object.keys(variants).length; i++) {
      if (uniqSize.indexOf(variants[i].size) === -1 && variants[i].size) {
        uniqSize.push(variants[i].size)
      }
    }
    return uniqSize
  }

  selectSize(size) {
    this.selectedSize = size;
  }

  // Increament
  increment() {
    this.counter++;
  }

  // Decrement
  decrement() {
    if (this.counter > 1) this.counter--;
  }

  // Add to cart
  async addToCart(product: any) {
    product.quantity = this.counter || 1;
    const status = await this.productService.addToCart(product);
    if (status)
      this.router.navigate(['/shop/cart']);
  }

  // Buy Now
  async buyNow(product: any) {
    product.quantity = this.counter || 1;
    const status = await this.productService.addToCart(product);
    if (status)
      this.router.navigate(['/shop/checkout']);
  }

  // Add to Wishlist
  addToWishlist(product: any) {
    this.productService.addToWishlist(product);
  }

  // Toggle Mobile Sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

}
