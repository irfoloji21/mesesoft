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
        const categories = data.categories;
        this.loadSubcategories(categories);
      }
    });
  }

  loadSubcategories(categories: any[]) {
    for (const category of categories) {
      if (category.subcategories) {
        category.megaMenu = true;
        for (const subcategory of category.subcategories) {
          if (subcategory._id) {
            const subcategoryId = subcategory._id;

            this.categoryService.getCategoryById(subcategoryId).subscribe((subCategoryData) => {

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
      MainMenu: subCategoryIds.join(',') 
    };

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

          if (childrenItem._id) {
            const subcategoryId = childrenItem._id;
            this.getSubcategoriesByItemId(subcategoryId, childrenItem);
          }
        });
      }
    });
    this.translationService.currentLang$.subscribe(lang => {
    });

    this.translationService.currentLang$.subscribe(lang => {

      this.translate.get('menuItems.item1').subscribe((translation: string) => {
      });
    });
  }

  getSubcategoriesByItemId(itemId: any, childrenItem: any) {
    this.categoryService.getCategoryById(itemId).subscribe((subcategories) => {
      childrenItem.subcategories = subcategories;
    });
  }

  mainMenuToggle(): void {
    this.categoryService.mainMenuToggle = !this.categoryService.mainMenuToggle;
  }

  getSubcategories(id) {
    this.categoryService.getCategoryById(id).subscribe((data) => {
      this.irfosub = data.category.subcategories;
    });
  }

  //MenuQueryParamsArea
  navigateWithQueryParams(menuItem: string, subItem: string, childrenSubItem: any) {
    this.product.irfan(childrenSubItem._id).subscribe(res => {
      this.handleSubCategoryResponse(menuItem, subItem, res);
    });
  }

  handleSubCategoryResponse(menuItem: string, subItem: string, res: any) {
    if (res.products && res.products.length > 0) {
      const productIds = res.products.map(product => product._id);

      const queryParams = {
        category: menuItem,
        subcategory: subItem,
        childrenSubItem: productIds,
      };



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







