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
        path: 'physical/collection',
        component: CategoryComponent,
        data: {
          title: "Collection",
          breadcrumb: "Collection"
        }
      },
      {
        path: 'physical/sub-category',
        component: SubCategoryComponent,
        data: {
          title: "Sub Category",
          breadcrumb: "Sub Category"
        }
      },
      {
        path: 'physical/product-list',
        component: ProductListComponent,
        data: {
          title: "Product List",
          breadcrumb: "Product List"
        }
      },
      {
        path: 'physical/product-detail/:id',
        component: ProductDetailComponent,
        data: {
          title: "Product Detail",
          breadcrumb: "Product Detail"
        }
      },
      {
        path: 'physical/add-product',
        component: AddProductComponent,
        data: {
          title: "Add Products",
          breadcrumb: "Add Product"
        }
      },
      {
        path: 'physical/productss',
        component: ProductssComponent,
        data: {
          title: "Add Products",
          breadcrumb: "Add Product"
        }
      },
      {
        path: 'physical/edit-product/:id',
        component: AddProductComponent,
        data: {
          title: "Edit Products",
          breadcrumb: "Edit Product"
        }
      },
      {
        path: 'digital/digital-category',
        component: DigitalCategoryComponent,
        data: {
          title: "Category",
          breadcrumb: "Category"
        }
      },
      {
        path: 'digital/edit-category/:id',
        component: DigitalAddComponent,
        data: {
          title: "Category",
          breadcrumb: "Category"
        }
      },
      {
        path: 'digital/digital-sub-category',
        component: DigitalSubCategoryComponent,
        data: {
          title: "Sub Category",
          breadcrumb: "Sub Category"
        }
      },
     
      {
        path: 'digital/digital-add-product',
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
