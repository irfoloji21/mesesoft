import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../classes/category';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit {

  public menuItems: Menu[];

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

  leftMenuToggle(): void {
    this.navServices.leftMenuToggle = !this.navServices.leftMenuToggle;
  }

  // Click Toggle menu (Mobile)
  toggletNavActive(item) {
    item.active = !item.active;
  }

  onHover(menuItem) {
    if(window.innerWidth > 1200 && menuItem){
       document.getElementById('unset').classList.add('sidebar-unset')
    } else {
      document.getElementById('unset').classList.remove('sidebar-unset')
    }
  }

}
