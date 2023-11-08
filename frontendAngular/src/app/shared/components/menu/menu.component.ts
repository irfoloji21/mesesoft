import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../classes/category';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public gorunecekKategoriler = [];

  public menuItems: Category[] = [];
  public subCategoryData: any[] = []; 
  public irfosub: any[] = [];
  megaMenu;
  active:any
  constructor(private router: Router, public navServices: NavService, public categoryService: CategoryService) {
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
          category.megaMenu = true ;
          // category.active=false
          for (const subcategory of category.subcategories) {
            if (subcategory._id) {
              const subcategoryId = subcategory._id;
              
              this.categoryService.getCategoryById(subcategoryId).subscribe((subCategoryData) => {
                
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
  }

  getSubcategoriesByItemId(itemId: any, childrenItem: any) {
    this.categoryService.getCategoryById(itemId).subscribe((subcategories) => {
      childrenItem.subcategories = subcategories; // Her alt kategoriye ait alt kategorileri güncelle
      // console.log(childrenItem.subcategories, "childrenItem.subcategories")
    });
  }

  mainMenuToggle(): void {
    this.categoryService.mainMenuToggle = !this.categoryService.mainMenuToggle;
  }

  // Click Toggle menu (Mobile)
  toggletNavActive(item) {
    item.active = !item.active;
  }

  getSubcategories(id) {
    this.categoryService.getCategoryById(id).subscribe((data) => {
      this.irfosub = data.category.subcategories;
      // console.log(data, "data");
    });
  }

}







