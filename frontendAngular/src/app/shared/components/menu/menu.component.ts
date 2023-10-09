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

  public menuItems: Category[] = [];

  constructor(private router: Router, public navServices: NavService , public categoryService:CategoryService) {
    this.categoryService.getCategories().subscribe((data: any) => {
     
      
      if (data.success) {
        this.menuItems = data.categories;
        this.menuItems.forEach((category: Category) => {
          category.megaMenu = true 
          category.active=false;
          category.megaMenu= true
         
        });
      }
  
    });
    this.router.events.subscribe((event) => {
      this.navServices.mainMenuToggle = false;
    });
  }

  ngOnInit(): void {
    
  }

  mainMenuToggle(): void {
    this.categoryService.mainMenuToggle = !this.categoryService.mainMenuToggle;
  }

  // Click Toggle menu (Mobile)
  toggletNavActive(item) {
    item.active = !item.active;
  }

}







