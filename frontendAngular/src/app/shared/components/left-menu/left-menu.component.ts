import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../classes/category';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit {

  public menuItems: Category[] = [];
  public subCategoryData: any[] = [];
  public irfosub: any[] = [];
  public subCategoryy: any = []
  megaMenu;
  active: any

  constructor(private router: Router, public navServices: NavService, public categoryService: CategoryService, private route: ActivatedRoute
    , private product: ProductService) {
    this.categoryService.getCategories().subscribe((data: any) => {
      if (data.success) {
        const categories = data.categories;
        this.loadSubcategories(categories);
      }
    });
  }
  ngOnInit(): void {
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
  }

  getSubcategoriesByItemId(itemId: any, childrenItem: any) {
    this.categoryService.getCategoryById(itemId).subscribe((subcategories) => {
      childrenItem.subcategories = subcategories;
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

  leftMenuToggle(): void {
    this.navServices.leftMenuToggle = !this.navServices.leftMenuToggle;
  }

  // Click Toggle menu (Mobile)
  toggletNavActive(item) {
    item.active = !item.active;
  }
  getSubcategories(id) {
    this.categoryService.getCategoryById(id).subscribe((data) => {
      this.irfosub = data.category.subcategories;
    });
  }

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
        childrenSubItem: productIds
      };
      this.router.navigate(['/shop/collection'], {
        relativeTo: this.route,
        queryParams,
      });
    } else {
      console.error("Ürün bulunamadı.");
    }
  }

  onHover(menuItem) {
    if (window.innerWidth > 1200 && menuItem) {
      document.getElementById('unset').classList.add('sidebar-unset')
    } else {
      document.getElementById('unset').classList.remove('sidebar-unset')
    }
  }

}
