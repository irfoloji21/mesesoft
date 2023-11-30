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
  constructor(public productService: ProductService, public categoryService: CategoryService, public collectionService: KoleksiyonService,
    private router: Router,private route: ActivatedRoute) {}

  ngOnInit(): void {
  }
  shopNow(slider: any) {
    this.productService.getProducts.subscribe((response: any) => {
      this.products = response.products;
    });
    const productsArray = Array.isArray(this.products) ? this.products : [this.products];
    const filteredProducts = productsArray.filter((product) => product.ratings >= 3 && product.ratings <= 5);
    const productIdss = filteredProducts.map((product) => product._id);
    console.log(productIdss, "productIdss");

    const queryParams = {
      theMostLiked: productIdss,
    };

    this.router.navigate(['/shop/collection/left/sidebar'], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
  public HomeSliderConfig: any = HomeSlider;

}
