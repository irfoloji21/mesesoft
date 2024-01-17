import { Component, OnInit } from '@angular/core';
import { NavService } from '../../services/nav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../classes/category';
import { ProductService } from '../../services/product.service';
import { TranslationService } from '../../services/translation.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {
  public gorunecekKategoriler = [];
  mainMenu: any = []
  public menuItems: Category[] = [];
  public subCategoryData: any[] = [];
  public irfosub: any[] = [];
  public subCategoryy: any = []
  ParentCategory: any = []
  megaMenu;
  active: any

  constructor(
    private router: Router,
    public navServices: NavService,
    public categoryService: CategoryService,
    private route: ActivatedRoute,
    private product: ProductService,
    private translationService: TranslationService,
    private translate: TranslateService
  ) {
    this.categoryService.getCategories().subscribe((data: any) => {
      if (data.success) {
        // Tüm kategorileri alın
        const categories = data.categories;
        // Kategori listesini döngüye alarak alt kategorileri yükleyin
        this.loadSubcategories(categories);
      }
    });
    // this.router.events.subscribe((event) => {
    //   this.navServices.mainMenuToggle = false;
    // });

 
    
  }

  loadSubcategories(categories: any[]) {
    for (const category of categories) {
      if (category.subcategories) {
        category.megaMenu = true;
        // category.active=false
        for (const subcategory of category.subcategories) {
          if (subcategory._id) {
            const subcategoryId = subcategory._id;

            this.categoryService.getCategoryById(subcategoryId).subscribe((subCategoryData) => {
              // console.log(subCategoryData , "subCategoryData")
              // Alt kategori ile yerini değiştirin

              const index = category.subcategories.findIndex(sub => sub._id === subCategoryData.category._id);
              if (index >= 0) {
                category.subcategories[index] = subCategoryData.category;
              }
            });
          }
        }
      }
    }

    this.menuItems = categories;
  }

  

  // Click Toggle menu (Mobile) (Main menu)
  toggletNavActive(item) {
    const subCategoryIds = item.subcategories.map(subcategory => subcategory._id);

    const queryParams = {
      MainMenu: subCategoryIds.join(',') // Alt kategori ID'lerini virgülle birleştirip string olarak ekledik
    };

    // Navigasyonu gerçekleştir
    this.router.navigate(['/shop/collection'], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });

    item.active = !item.active;
  }

  ngOnInit() {
    this.menuItems.forEach((menuItem) => {
      if (menuItem.subcategories) {
        menuItem.subcategories.forEach((childrenItem) => {
          // console.log(childrenItem._id, "childrenItem._id")

          if (childrenItem._id) {
            const subcategoryId = childrenItem._id;
            this.getSubcategoriesByItemId(subcategoryId, childrenItem);
          }
        });
      }
    });
    this.translationService.currentLang$.subscribe(lang => {
      // Dil değiştiğinde yapılacak işlemler
      console.log('Current Language:', lang);
      // Diğer işlemler...
    });

    this.translationService.currentLang$.subscribe(lang => {
      console.log('Current Language:', lang);
    
      // Çevirilen metinleri kontrol etmek için
      this.translate.get('menuItems.item1').subscribe((translation: string) => {
        console.log('Translated Text for item1:', translation);
        console.log('Translated Text for item1:', this.translate.instant('menuItems.item1'));

      });
    });
  }

  getSubcategoriesByItemId(itemId: any, childrenItem: any) {
    this.categoryService.getCategoryById(itemId).subscribe((subcategories) => {
      console.log(subcategories, "subcategoriesMenu")
      childrenItem.subcategories = subcategories; // Her alt kategoriye ait alt kategorileri güncelle
      // console.log(childrenItem.subcategories, "childrenItem.subcategories")
    });
  }

  mainMenuToggle(): void {
    this.categoryService.mainMenuToggle = !this.categoryService.mainMenuToggle;
  }

  getSubcategories(id) {
    this.categoryService.getCategoryById(id).subscribe((data) => {
      this.irfosub = data.category.subcategories;
      // console.log(data, "data");
    });
  }

  //MenuQueryParamsAlanı
  navigateWithQueryParams(menuItem: string, subItem: string, childrenSubItem: any) {
    this.product.irfan(childrenSubItem._id).subscribe(res => {
      this.handleSubCategoryResponse(menuItem, subItem, res);
    });
  }

  handleSubCategoryResponse(menuItem: string, subItem: string, res: any) {
    // console.log(res, "emsal");
    if (res.products && res.products.length > 0) {
      const productIds = res.products.map(product => product._id);

      const queryParams = {
        category: menuItem,
        subcategory: subItem,
        childrenSubItem: productIds,
      };

      console.log(queryParams, "mehmet");

      this.router.navigate(['/shop/collection'], {
        relativeTo: this.route,
        queryParams,

      });
    } else {
      console.error("Ürün bulunamadı.");
    }
  }

  selectedLanguage: string = 'en';


  
}







