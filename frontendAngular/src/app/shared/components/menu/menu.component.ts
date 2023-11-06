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
  constructor(private router: Router, public navServices: NavService, public categoryService: CategoryService) {
    this.categoryService.getCategories().subscribe((data: any) => {
      if (data.success) {
        this.menuItems = data.categories;
        // console.log(this.menuItems, "menuItems")
        this.menuItems.forEach((category: Category) => {
          category.megaMenu = true;
          category.active = false;
          category.megaMenu = true;
          // console.log(category.subcategories, "category.subcategories")

          if(category.isShow){
            // console.log(category, "category")
            this.gorunecekKategoriler.push(category);
          }

          if (category.subcategories) {
            for (const subcategory of category.subcategories) {
              if (subcategory._id) {
                const subcategoryId = subcategory._id;

                // console.log(subcategoryId, "subcategoryId")
                this.categoryService.getCategoryById(subcategoryId).subscribe((subCategoryData) => {
                  // console.log(subCategoryData.category, "subCategoryData");
                  this.subCategoryData.push(subCategoryData.category);
                  // 
                    this.gorunecekKategoriler.forEach((gorunecekKategoriler: any) => {
                      gorunecekKategoriler.subcategories.forEach((subcategory: any) => {
                      // console.log(gorunecekKategoriler, "gorunecekKategoriler")
                      // console.log(subCategoryData.category, "subCategoryData.category")
                    if (subcategory._id === subCategoryData.category._id) {
                      console.log(subCategoryData.category, "subCategoryData.category")
                    }
                  })
                  })
                  

                  // this.menuItems.forEach((category: Category) => {
                  //   category.subcategories.forEach((subcategory: any) => {
                  //      console.log(subcategory, "subcategory")
                  //     this.subCategoryData.forEach((subCategoryData: any) => {
                  //       subCategoryData.subcategories.forEach((subcategory2: any) => {
                  //         console.log(subcategory2, "subcategory2")
                  //       if (subcategory._id === subcategory2._id) {
                  //           // console.log(subcategory, "subcategory");
                  //         }
                        
                  //     });
                  //     });
                      
                  //     });
                  // });
                  



                });
              }
            }
           }
        });
      }
    });
    this.router.events.subscribe((event) => {
      this.navServices.mainMenuToggle = false;
    });

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







