import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../shared/data/slider';
import { Product } from '../../../shared/classes/product';
import { ProductService } from '../../../shared/services/product.service';
import { AuthService } from '../../../shared/services/auth.service';
import { SizeModalComponent } from "../../../shared/components/modal/size-modal/size-modal.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { OrderService } from 'src/app/shared/services/order.service';
import { SocialMediaService } from 'src/app/shared/services/social-media.service';

@Component({
  selector: 'app-product-sidebar',
  templateUrl: './product-sidebar.component.html',
  styleUrls: ['./product-sidebar.component.scss'],
})

export class ProductSidebarComponent implements OnInit {
  public product: Product = {};
  public counter: number = 1;
  public activeSlide: any = 0;
  public selectedSize: any;
  public mobileSidebar: boolean = false;
  public active = 1;
  visibleReviews: number = 2;
  reviewForm: FormGroup;
  selectedRating: number;
  public userId: string;
  public doubleDipping: boolean = false;
  filteredOrders: any[] = [];
  comment: any = {}
  isInWishlist: boolean = false;
  showReviewForm: boolean = false;
  public socialMediaLinks: any;
  public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;
  @ViewChild("sizeChart") SizeChart: SizeModalComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public productService: ProductService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public authService: AuthService,
    private sanitizer: DomSanitizer,
    private orderService: OrderService,
    private socialMediaService: SocialMediaService
  ) {
    this.route.data.subscribe(response => {
      this.product = response.data.product;
      this.product.ratings = this.roundToHalf(this.product.ratings);
      this.reviewForm = this.formBuilder.group({
        rating: [null, Validators.required],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        reviewTitle: ['', Validators.required],
        comment: ['', Validators.required],
      });
    });
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userId = user.user._id;
    this.loadUserOrders(this.userId);
    this.submitReview();
    this.socialMediaService.getSocialMediaLinks().subscribe(links => {
      this.socialMediaLinks = links;
    });
  }

  openSharePopup(shareUrl: string) {
    const productUrl = encodeURIComponent(window.location.href);
    window.open(shareUrl, '_blank');

  }

  loadUserOrders(userId: string) {
    this.orderService.getOrders(userId).subscribe(
      (res) => {
        this.filteredOrders = res.orders;
        const user = this.authService.getUser();
        this.showReviewForm = this.filteredOrders.some(order =>
          order.cart.some(product => product._id === this.product._id)
        );
        this.doubleDipping = this.product.reviews.some(review => review.user._id === user.user._id)

      },
      (error) => {
        console.error(error);
      }
    );
  }

  roundToHalf(value: number): number {
    const decimal = value - Math.floor(value);
    if (decimal < 0.25) {
      return Math.floor(value);
    } else if (decimal < 0.75) {
      return Math.floor(value) + 0.5;
    } else {
      return Math.ceil(value);
    }
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  hideMoreReviews() {
    this.visibleReviews = 2;
  }

  showMoreReviews() {
    this.visibleReviews += 3;
  }


  submitReview() {
    if (this.reviewForm.valid) {
      const user = this.authService.getUser();
      this.comment = {
        productId: this.product._id,
        rating: this.reviewForm.value.rating,
        comment: this.reviewForm.value.comment,
        name: this.reviewForm.value.name,
        email: this.reviewForm.value.email,
        reviewTitle: this.reviewForm.value.reviewTitle,
        user: user
      };
      this.productService.createNewReview(this.comment).subscribe({
        next: (response) => {
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
    // if (status)
    //   this.router.navigate(['/shop/cart']);
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
    event.preventDefault();
    this.isInWishlist = !this.isInWishlist;
  }

  // Toggle Mobile Sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }
}