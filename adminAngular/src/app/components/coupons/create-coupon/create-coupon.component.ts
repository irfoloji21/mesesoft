import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateStruct, NgbDate, NgbCalendar, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/service/auth.service';
import { CategoryService } from 'src/app/shared/service/category.service';
import { CouponService } from 'src/app/shared/service/coupon.service';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.scss']
})
export class CreateCouponComponent implements OnInit {
  categories: any[] = [];
  products: any[] = [];



  public combinedForm: UntypedFormGroup;
  public model: NgbDateStruct;
  public date: { year: number, month: number };
  public modelFooter: NgbDateStruct;
  public active = 1;

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private calendar: NgbCalendar,
    private productService: ProductService, 
    private authService: AuthService, 
    private categoryService: CategoryService,
    private couponService: CouponService,
    private router: Router
    ) {
    this.createGeneralForm();
  }

  selectToday() {
    this.model = this.calendar.getToday();
  }

  createGeneralForm() {
    this.combinedForm = this.formBuilder.group({
      name: [''],
      code: [''],
      start_date: [''],
      end_date: [''],
      free_shipping: [false],
      quantity: [''],
      discount_type: [''],
      status: [false],
      products: [''],
      category: [''],
      min: [''],
      max: [''],
      limit: [''],
      customer: ['']
    });
  }





  submitCombinedForm() {
    
    if (this.combinedForm.valid) {
      const formData = this.combinedForm.value;
      const shop = this.authService.getShop();

      formData.shopId = shop.seller._id;
      this.couponService.createCoupoun(formData).subscribe(
        (response) => {
          this.router.navigate(['/coupons/list-coupons']);
        },
        (error) => {
        }
      );
    }
  }



  ngOnInit() {

  

    
    this.categoryService.getCategory().subscribe(
      (response) => {
        this.categories = response.categories;

        const shop = this.authService.getShop();
        this.productService.getShopProduct(shop.seller._id).subscribe(
          (response) => {
            this.products = response.products;
          },
          (error) => {
            console.error(error);
          }
        );

      },
      (error) => {
        console.error(error);
      }
    );







  }




}
