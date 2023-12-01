import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from "../../../shared/services/product.service";
import { Product } from '../../../shared/classes/product';
import { Category } from 'src/app/shared/classes/category';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-collection-left-sidebar',
  templateUrl: './collection-left-sidebar.component.html',
  styleUrls: ['./collection-left-sidebar.component.scss']
})
export class CollectionLeftSidebarComponent implements OnInit {
  
  public grid: string = 'col-xl-3 col-md-6';
  public layoutView: string = 'grid-view';
  public products: Product[] = [];
  public brands: any[] = [];
  public colors: any[] = [];
  public size: any[] = [];
  public minPrice: number = 0;
  public maxPrice: number = 1200;
  public tags: any[] = [];
  public category: any;
  menuItems: any[] = []; 
  public Megamenu: any;
  public categoryEs : any ; 
  public  Image : any;
  public pageNo: number = 1;
  public paginate: any = {}; // Pagination use only
  public sortBy: string; // Sorting Order
  public mobileSidebar: boolean = false;
  public loader: boolean = true;
  public categoryContent :Category[] = []
  public filteredIds : any= []
  public theMostLiked:any = []
  public selectedCategoryDetails: any = [];
  public searchQuery: string = '';
  constructor(private route: ActivatedRoute, private router: Router,
    private viewScroller: ViewportScroller, public productService: ProductService , private categoryService : CategoryService) {

    // Get Query params..
    this.route.queryParams.subscribe(params => {

      this.filteredIds = params.filteredIds ? params.filteredIds.split(',') : [];
       this.theMostLiked = params.theMostLiked ?params.theMostLiked : [];
      console.log(this.theMostLiked,"theMostLiked")
      this.searchQuery = params.search ? params.search : '';
      this.brands = params.brand ? params.brand.split(",") : [];
      this.colors = params.color ? params.color.split(",") : [];
      this.size = params.size ? params.size.split(",") : [];
      this.minPrice = params.minPrice ? params.minPrice : this.minPrice;
        this.maxPrice = params.maxPrice ? params.maxPrice : this.maxPrice;
      this.tags = [...this.brands, ...this.colors, ...this.size]; // All Tags Array
      

      
       this.Megamenu = params.childrenSubItem ? params.childrenSubItem : null;
      console.log(this.Megamenu, "megaMenu");
      this.category = params.categoryId ? params.categoryId : null;
      this.categoryEs = params.description ? params.description : null
      this.Image = params.images ? params.images : null
      this.sortBy = params.sortBy ? params.sortBy : 'ascending';
      this.pageNo = params.page ? params.page : this.pageNo;
     
     
      this.productService.filterProducts(this.tags).subscribe((response:any) => {
        // console.log(response[0].products , "Collection")
     
        this.products = this.parseResponse(response);
        if (this.theMostLiked.length > 0) {
          // theMostLiked And Recently addedd products
          this.products = this.products.filter(item => this.theMostLiked.includes(item._id));
        }
        this.products = this.productService.sortProducts(this.products, this.sortBy);

         // collection %50 filter
           if (this.filteredIds && this.filteredIds.length > 0) {
          this.products = this.products.filter(item => this.filteredIds.includes(item._id));
          }

              // Megamenu Filter
              if (this.Megamenu) {
                this.products = this.products.filter(item => this.Megamenu.includes(item._id));
              }
              
        if (this.searchQuery) {
          this.products = this.products.filter(item => {
            return item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
          });
        }
        if (this.category) {
          this.products = this.products.filter(item => item.category == this.category);
        }
        this.products = this.products.filter(item => item.discountPrice >= this.minPrice && item.originalPrice <= this.maxPrice);
        this.paginate = this.productService.getPager(this.products.length, +this.pageNo); // get paginate object from service
        this.products = this.products.slice(this.paginate.startIndex, this.paginate.endIndex + 1); // get current page of items
      });
    });
  }
  
 
  parseResponse(response: any): any {
    if (Array.isArray(response) && response.length > 0 && response[0].products) {
      return response[0].products;
    } else {
      return [];
    }
  }
  



  ngOnInit(): void {
    
  }
  


  // Append filter value to Url
  updateFilter(tags: any) {
    tags.page = null; // Reset Pagination
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: tags,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // SortBy Filter
  sortByFilter(value) {
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: { sortBy: value ? value : null},
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Remove Tag
  removeTag(tag) {
  
    this.brands = this.brands.filter(val => val !== tag);
    this.colors = this.colors.filter(val => val !== tag);
    this.size = this.size.filter(val => val !== tag );

    let params = { 
      brand: this.brands.length ? this.brands.join(",") : null, 
      color: this.colors.length ? this.colors.join(",") : null, 
      size: this.size.length ? this.size.join(",") : null
    }

    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Clear Tags
  removeAllTags() {
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: {},
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // product Pagination
  setPage(page: number) {
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Change Grid Layout
  updateGridLayout(value: string) {
    this.grid = value;
  }

  // Change Layout View
  updateLayoutView(value: string) {
    this.layoutView = value;
    if(value == 'list-view')
      this.grid = 'col-lg-12';
    else
      this.grid = 'col-xl-3 col-md-6';
  }

  // Mobile sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

}
