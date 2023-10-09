import { Component, OnInit } from '@angular/core';
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
    // Tüm kategorilerin adını bir dizi olarak al
    const categoryNames = this.categories.map(category => category.name);
    // kategorılerden tekrarlananları kadlır
    return [...new Set(categoryNames)];
  }
}
