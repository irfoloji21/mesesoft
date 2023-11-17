import { Component, OnInit, Input } from '@angular/core';
import { ProductSlider } from '../../../shared/data/slider';
import { Product } from '../../../shared/classes/product';
import { ProductService } from '../../../shared/services/product.service';
import { Category } from 'src/app/shared/classes/category';
import { CategoryService } from 'src/app/shared/services/category.service';

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
  public sliders: any[] = [];
  public active;
  constructor(public productService: ProductService, public categoryService: CategoryService) {
  this.productService.getProducts.subscribe((response: any) => {
    this.products = response.products
    this.productCollections = this.products.map(product => product);    
  });
  this.categoryService.getCategories().subscribe((data: any) => {
    if (data.success) {
      this.categories = data.categories;
      this.sliders = this.categories.map(category => {        
        const image = Array.from(category.images as any[]).map(image => (image as any).url);
        return {
          title: category.name,
          subTitle: category.description,
          image,
        };
      });
    }
  });
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
  public collections = [{
    image: 'assets/images/collection/fashion/1.jpg',
    save: 'save 50%',
    title: 'men'
  }, {
    image: 'assets/images/collection/fashion/2.jpg',
    save: 'save 50%',
    title: 'women'
  }];

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
  }

  // Product Tab collection
    getCollectionProducts(collection) {
      return this.collections.filter((item) => {
        // console.log(item.title);
        
        if (item.title === collection) {
          // console.log(item);
          return item
        }
      })
      // return this.products.filter((item) => {
        // if (item.collection.find(i => i === collection)) {
        //   return item
        // }
      // })
    }

}
