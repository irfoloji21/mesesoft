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
  @Output() categorySelected: EventEmitter<string> = new EventEmitter<string>(); 
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
      .map(category => category.name);
    return [...new Set(categoryNames)];
  }

  // selectCategory(categoryId: string) {
  //   this.categorySelected.emit(categoryId); 
  // }
}
