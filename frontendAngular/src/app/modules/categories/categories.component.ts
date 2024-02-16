import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/shared/classes/category';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  public categories: Category[] = [];
  public collapse: boolean = true;
  public SelectCategory: string | null = null;
  private categorySubscription: Subscription | undefined;

  constructor(public categoryService: CategoryService, private router: Router, private product: ProductService) {}

  ngOnInit(): void {
    this.categorySubscription = this.categoryService.getCategories().subscribe((data: any) => {
      if (data.success) {
        this.categories = data.categories;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
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
    this.product.ProductsByCategory(childrenSubItem._id).subscribe(res => {
    });
  }
}
