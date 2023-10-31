import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../classes/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  public categories: Category[] = [];
  public collapse: boolean = true;
  public SelectCategory: string | null = null;
  constructor(public categoryService: CategoryService) { 
    this.categoryService.getCategories().subscribe((data: any) => {
      if (data.success) {
        this.categories = data.categories;
      }
    });
  }

  ngOnInit(): void {
  }

  get filterbyCategory() {
    const categoryNames = this.categories
    .filter(category => category.isShow === true) 
    .map(category => ({
       name: category.name, 
        _id: category._id ,
        description:category.description 

        }));
    return [...new Set(categoryNames)];
  }

  selectCategory(category: Category) {
    this.SelectCategory = category.description;
  }
}
