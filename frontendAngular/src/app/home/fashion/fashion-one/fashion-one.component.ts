import { Component, OnInit, Input } from '@angular/core';
import { ProductSlider } from '../../../shared/data/slider';
import { Product } from '../../../shared/classes/product';
import { ProductService } from '../../../shared/services/product.service';
import { Category } from 'src/app/shared/classes/category';
import { CategoryService } from 'src/app/shared/services/category.service';
import { KoleksiyonService } from 'src/app/shared/services/collection.service';
import { Collection } from 'src/app/shared/classes/koleksiyon';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fashion-one',
  templateUrl: './fashion-one.component.html',
  styleUrls: ['./fashion-one.component.scss']
})
export class FashionOneComponent implements OnInit {

  @Input() blog: any[] = [];
  public products: Product[] = [];
  public productCollections: any[] = [];
  public categories: Category[] = [];
  public collections: any = [];
  public sliders: any[] = [];
  public active;
  public sortedProducts :any = []
  constructor(public productService: ProductService, public categoryService: CategoryService, public collectionService: KoleksiyonService,
    private router: Router,private route: ActivatedRoute) {
      this.collectionService.getKoleksiyons().subscribe((response: any) => {
        this.collections = response.koleksiyons;
        this.sliders = this.collections
        .filter(collection => collection.isShow === true)
        .map(collection => ({
          title: collection.name,
          subTitle: collection.description,
          image: collection?.images[0]?.url,
        }));
      
      })
}



  public ProductSliderConfig: any = ProductSlider;

  // public sliders = [{
  //   title: 'welcome to fashion',
  //   subTitle: 'Men fashion',
  //   image: 'assets/images/slider/1.jpg'
  // }, {
  //   title: 'welcome to fashion',
  //   subTitle: 'Women fashion',
  //   image: 'assets/images/slider/2.jpg'
  // }]

  // Collection banner
  // public collectionssMan = [{
  //   image: 'assets/images/collection/fashion/1.jpg',
  //   save: 'save 50%',
  //   title: 'men'
  // }];
  // public collectionssWomen = [{
  //   image: 'assets/images/collection/fashion/1.jpg',
  //   save: 'save 50%',
  //   title: 'men'
  // }];

  // Logo
  public logo = [{
    image: 'assets/images/logos/1.png',
  }, {
    image: 'assets/images/logos/2.png',
  }, {
    image: 'assets/images/logos/3.png',
  }, {
    image: 'assets/images/logos/4.png',
  }, {
    image: 'assets/images/logos/5.png',
  }, {
    image: 'assets/images/logos/6.png',
  }, {
    image: 'assets/images/logos/7.png',
  }, {
    image: 'assets/images/logos/8.png',
  }];





  ngOnInit(): void {

   
    this.topCollection();
  }
  
  topCollection(){
     this.productService.getProducts.subscribe((products: any) => {
       const productArray = Array.isArray(products.products) ? products.products : []; 
   
       this.sortedProducts = productArray
         .filter(product => product.sold_out > 0)
         .sort((a, b) => b.sold_out - a.sold_out);
     
       console.log(this.sortedProducts)
     });
   }

   loadDataMen(): void {
    this.productService.getProducts.subscribe((products: any) => {
      const productArray = Array.isArray(products.products) ? products.products : [];
    
      const filteredProducts = productArray
         .filter(product => product.gender === 'man')
        .filter(product => product.discountPrice > 0)   
        .filter(product => {
          const discountPercentage = ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100;
          console.log(discountPercentage, "discountPercentage"); 
          return discountPercentage <=  50;
        });
  
      const productIds = filteredProducts.map(product => product._id);
      
      const queryParams = {
        filteredIds: productIds.join(',')
      };
  
      this.router.navigate(['/shop/collection/left/sidebar'], {
        queryParams,
        queryParamsHandling: 'merge' 
      });
    });
  }

   loadDataWoman(): void {
    this.productService.getProducts.subscribe((products: any) => {
      const productArray = Array.isArray(products.products) ? products.products : [];
    
      const filteredProducts = productArray
         .filter(product => product.gender === 'woman')
        .filter(product => product.discountPrice > 0)   
        .filter(product => {
          const discountPercentage = ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100;
          console.log(discountPercentage, "discountPercentage"); 
          return discountPercentage <=  50;
        });
  
      const productIds = filteredProducts.map(product => product._id);
      
      const queryParams = {
        filteredIds: productIds.join(',')
      };
  
      this.router.navigate(['/shop/collection/left/sidebar'], {
        queryParams,
        queryParamsHandling: 'merge' 
      });
    });
  }




}
