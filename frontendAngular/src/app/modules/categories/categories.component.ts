import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../classes/category';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  public categories: Category[] = [];
  public collapse: boolean = true;
  public SelectCategory: string | null = null;
  constructor(public categoryService: CategoryService, private router: Router, private product: ProductService) {
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
        _id: category._id,
        images: category.images[0].url,
        description: category.description
      }));
    return [...new Set(categoryNames)];
  }

  navigateToCategory(category: any) {
    const queryParams = {
      categoryId: category._id,
      categoryName: category.name
    };
    if (category.description) {
      queryParams['description'] = category.description;
    }
    if (category.images) {
      queryParams['images'] = category.images;
    }
    this.router.navigate(['/shop/collection'], { queryParams });
  }

  navigateWithQueryParams(childrenSubItem: any) {
    this.product.irfan(childrenSubItem._id).subscribe(res => {
    });
  }
}


