import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './product/category/category.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { SubCategoryComponent } from './product/sub-category/sub-category.component';
import { DigitalAddComponent } from './category/category-add/digital-add.component';
import { DigitalCategoryComponent } from './category/category-main/digital-category.component';
import { DigitalSubCategoryComponent } from './category/category-sub/digital-sub-category.component';
import { AddProductComponent } from './product/products-add/add-product.component';
import { ProductListComponent } from './product/products-list/product-list.component';
import { ProductssComponent } from './product/products-main-page/productss/productss.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'catalog/collection',
        component: CategoryComponent,
        data: {
          title: "Collection",
          breadcrumb: "Collection"
        }
      },
      {
        path: 'catalog/sub-category',
        component: SubCategoryComponent,
        data: {
          title: "Sub Category",
          breadcrumb: "Sub Category"
        }
      },
      {
        path: 'catalog/product-list',
        component: ProductListComponent,
        data: {
          title: "Product List",
          breadcrumb: "Product List"
        }
      },
      {
        path: 'catalog/product-detail/:id',
        component: ProductDetailComponent,
        data: {
          title: "Product Detail",
          breadcrumb: "Product Detail"
        }
      },
      {
        path: 'catalog/add-product',
        component: AddProductComponent,
        data: {
          title: "Add Products",
          breadcrumb: "Add Product"
        }
      },
      {
        path: 'catalog/productss',
        component: ProductssComponent,
        data: {
          title: "Add Products",
          breadcrumb: "Add Product"
        }
      },
      {
        path: 'catalog/edit-product/:id',
        component: AddProductComponent,
        data: {
          title: "Edit Products",
          breadcrumb: "Edit Product"
        }
      },
      {
        path: 'category/main-category',
        component: DigitalCategoryComponent,
        data: {
          title: "Category",
          breadcrumb: "Category"
        }
      },
      {
        path: 'category/edit-category/:id',
        component: DigitalAddComponent,
        data: {
          title: "Category",
          breadcrumb: "Category"
        }
      },
      {
        path: 'category/sub-sub-category',
        component: DigitalSubCategoryComponent,
        data: {
          title: "Sub Category",
          breadcrumb: "Sub Category"
        }
      },
     
      {
        path: 'category/digital-add-product',
        component: DigitalAddComponent,
        data: {
          title: "Add Products",
          breadcrumb: "Add Product"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
