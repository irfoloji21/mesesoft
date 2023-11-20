import { Component, OnInit, Input } from '@angular/core';
import { ProductSlider } from '../../../shared/data/slider';
import { Product } from '../../../shared/classes/product';
import { ProductService } from '../../../shared/services/product.service';
import { Category } from 'src/app/shared/classes/category';
import { CategoryService } from 'src/app/shared/services/category.service';
import { KoleksiyonService } from 'src/app/shared/services/collection.service';
import { Collection } from 'src/app/shared/classes/koleksiyon';

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
  public collections: Collection[] = [];
  public sliders: any[] = [];
  public active;
  constructor(public productService: ProductService, public categoryService: CategoryService, public kolleksiyonService: KoleksiyonService) {
  this.productService.getProducts.subscribe((response: any) => {
    this.products = response.products
    this.productCollections = this.products
      .filter(product => product.sold_out > '0')  // Filtreleme işlemi
      .map(product => {
        const image = (product.images as any[]).map(image => image.url);
        return {
          title: product.name,
          subTitle: product.description,
          image,
        };
      });
  });

  this.kolleksiyonService.getKoleksiyons().subscribe((response: any) => {
    this.collections = response.koleksiyons;
    this.sliders = this.collections.filter(collection => collection.isShow === true).map(collection => {
      return {
        title: collection.name,
        subTitle: collection.description,
        image: collection?.images[0]?.url,
      };
    });
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
  public collectionss = [{
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
    //     console.log(item.title);
        
    //     if (item.title === collection) {
    //       console.log(item);
    //       return item
    //     }
      })
      // return this.products.filter((item) => {
        // if (item.collection.find(i => i === collection)) {
        //   return item
        // }
      // })
    }

}
