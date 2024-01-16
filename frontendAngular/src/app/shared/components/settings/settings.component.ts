import { Component, OnInit, Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from "../../services/product.service";
import { Product } from "../../classes/product";
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  searchForm: FormGroup;
  public products: Product[] = [];
  public search: boolean = false;
  public noProductsFound: boolean = false;

  public languages = [
    {
      name: 'English',
      code: 'en'
    }, {
      name: 'French',
      code: 'fr'
    }
  ];

  public currencies = [
    {
      name: 'Euro',
      currency: 'EUR',
      price: 0.90 // price of euro
    }, {
      name: 'Rupees',
      currency: 'INR',
      price: 70.93 // price of inr
    }, {
      name: 'Pound',
      currency: 'GBP',
      price: 0.78 // price of euro
    }, {
      name: 'Dollar',
      currency: 'USD',
      price: 1 // price of usd
    }
  ]

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object,
    private translate: TranslateService,
    public productService: ProductService,
    private formBuilder: FormBuilder
  ) {
    this.searchForm = this.formBuilder.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.productService.cartItems.subscribe(response => {
      this.products = response
    });
    
    this.getSearch();
  }

  changeLanguage(code) {
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(code)
    }
  }
  getSearch() {
    const productSearch = this.searchForm.value.search;
  }

  searchToggle() {
    this.search = !this.search;
  }

  searchProduct() {
    this.productService.search(this.searchForm.value.search).subscribe(response => {
      this.products = response;
      this.noProductsFound = response.length === 0;
    });
  }

 

  get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  removeItem(product: any) {
    this.productService.removeCartItem(product);
  }

  changeCurrency(currency: any) {
    this.productService.Currency = currency
  }

}
