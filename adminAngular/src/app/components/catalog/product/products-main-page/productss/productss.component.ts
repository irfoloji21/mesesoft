import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { ProductService } from 'src/app/shared/service/product.service';
import { Image } from '@ks89/angular-modal-gallery';
import { Product } from 'src/app/shared/tables/product';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { id } from '@swimlane/ngx-charts';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-productss',
  templateUrl: './productss.component.html',
  styleUrls: ['./productss.component.scss']
})
export class ProductssComponent {
  searchForm: FormGroup;
  public closeResult: string;
  public counter: number = 1;
  currentRate = 8;
  productId: string;
  productDetail: Product;
  productImages: any[] = [];
  elems: any[] = [];
  isFilterApplied: boolean = false;
  imagesRect: Image[] = [
    new Image(0, { img: 'assets/images/furniture/6.jpg' }),
  ]
  public product_list = []
  public isModalOpen: boolean = false;
  public filteredProducts: any[] = [];
  isButtonClicked: boolean = false;
  originalProductList: any[] = [];
  searchText;
  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.fb.group({
      searchText: ['']
    });

    this.searchForm.get('searchText').valueChanges.subscribe(value => {
      if (this.isButtonClicked) {
        this.search();
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openModal() {
    this.isModalOpen = true;
  }



  editProduct(id) {
    this.router.navigate(['/products/catalog/edit-product', id]);
  }

  addProduct() {
    this.router.navigate(['/products/catalog/add-product']);
  }

  detailProduct(product: Product): void {
    this.productDetail = product;
    this.productImages = product.images;
    this.imagesRect = this.productImages.map((image, index) => {
      return new Image(index, { img: image.url }, { img: image.url });
    });

    this.openModal();
  }
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  ngOnInit() {
    this.authService.loadShop().subscribe(
      (shop) => {
        if (shop) {
          const id = shop.seller._id;
          this.productService.getShopProduct(id).subscribe(
            (response) => {
              this.product_list = response.products;
              this.originalProductList = [...this.product_list];
            },
            (error) => {
              console.error(error);
            }
          );
        }
      },
      (error) => {
        console.error('Kullanıcı kimliği belirleme hatası:', error);
      }
    );
  }

  // // actions delete start
  selectedAction: string = '';
  selectedProducts: Product[] = [];

  deleteProduct(id) {
    this.productService.deleteProduct(id).subscribe(
      (response) => {
        this.ngOnInit()
        this.product_list;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  toggleSelection(product: any): void {
    product.selected = !product.selected;
    this.updateSelectedProducts();
  }

  updateSelectedProducts(): void {
    this.selectedProducts = this.product_list.filter(product => product.selected);
  }

  deleteSelectedProducts(): void {
    if (this.selectedProducts.length === 0) {
      return;
    }

    this.selectedProducts.forEach(product => {
      this.deleteProduct(product._id);
    });
  }

  onActionChange(event: any): void {
    this.selectedAction = event.target.value;
    if (this.selectedAction === 'delete') {
      this.deleteSelectedProducts();
    }
  }
  // // actions delete end


  // Search Area start

  search() {
    const searchText = this.searchForm.get('searchText').value.trim().toLowerCase();
  
    if (searchText === '') {
      this.product_list = [...this.originalProductList];
      this.filteredProducts = []; 
    } else {
      this.filteredProducts = this.originalProductList.filter(product => {
        const nameMatch = (product.name as string).toLowerCase().includes(searchText);
        return nameMatch;
      });
  
      if (this.filteredProducts.length > 0) {
        this.product_list = this.filteredProducts;
      } else {
        this.product_list = [];
      }
    }
    this.isFilterApplied = true;
    this.cdr.detectChanges();
  }
  
  buttonClick() {
    const searchText = this.searchForm.get('searchText').value.trim().toLowerCase();
    if (searchText === '') {
      this.clearAll(); 
      return; 
    }
  
    this.isFilterApplied = true;
    this.isButtonClicked = true;
    this.search(); 
    this.isButtonClicked = false; 
    document.getElementById('searchTextSpan').textContent = searchText; 
  }
  
  clearAll() {
    this.searchForm.get('searchText').setValue('');
    this.product_list = [...this.originalProductList];
    this.isFilterApplied = false;
  }
// Search Area End



}






