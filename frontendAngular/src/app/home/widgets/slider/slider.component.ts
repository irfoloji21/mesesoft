import { Component, OnInit, Input } from '@angular/core';
import { HomeSlider } from '../../../shared/data/slider';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoryService } from 'src/app/shared/services/category.service';
import { KoleksiyonService } from 'src/app/shared/services/collection.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  
  @Input() sliders: any[];
  @Input() class: string;
  @Input() textClass: string;
  @Input() category: string;
  @Input() buttonText: string;
  @Input() buttonClass: string;
  @Input() products: any  =[]
  slider : any =[]
  constructor(public productService: ProductService, public categoryService: CategoryService, public collectionService: KoleksiyonService,
    private router: Router,private route: ActivatedRoute) {}

  ngOnInit(): void {
  }

  shopNow(slider: any) {
    this.collectionService.getKoleksiyons().subscribe(res => {
      this.slider=res;
    })
    if (slider.subTitle==="The most liked products") {
      this.shopNowMostLiked();
    } else if (slider.subTitle==="Recently added products") {
      this.shopNowNewProducts();
    }
  }

  shopNowMostLiked() {
    this.productService.getProducts.subscribe((response: any) => {
      this.products = response.products;
    });
    const productsArray = Array.isArray(this.products) ? this.products : [this.products];
    const filteredProducts = productsArray.filter((product) => product.ratings >= 3 && product.ratings <= 5);
    const productIdss = filteredProducts.map((product) => product._id);

    const queryParams = {
      theMostLiked: productIdss,
    };

    this.router.navigate(['/shop/collection/left/sidebar'], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
  shopNowNewProducts() {
    this.productService.getProducts.subscribe((response: any) => {
      this.products = response.products;

      const currentDate = new Date();
      const tenDaysAgo = new Date(currentDate);
      tenDaysAgo.setDate(currentDate.getDate() - 10);

      const filteredProducts = this.products.filter((product) => {
        const createdAtDate = new Date(product.createdAt);
        return createdAtDate >= tenDaysAgo && createdAtDate <= currentDate;
      });

      const newProductsId = filteredProducts.map((product) => product._id);

      const queryParams = {
        theMostLiked: newProductsId,
      };

      this.router.navigate(['/shop/collection/left/sidebar'], {
        queryParams,
        queryParamsHandling: 'merge',
      });
    });
  }

  public HomeSliderConfig: any = HomeSlider;

}
