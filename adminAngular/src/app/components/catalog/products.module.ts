import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductsRoutingModule } from './products-routing.module';


import { GalleryModule } from '@ks89/angular-modal-gallery';
import 'hammerjs';
import 'mousetrap';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
// search module
import { SharedModule } from 'src/app/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { DigitalAddComponent } from './category/category-add/digital-add.component';
import { DigitalCategoryComponent } from './category/category-main/digital-category.component';
import { DigitalSubCategoryComponent } from './category/category-sub/digital-sub-category.component';
import { CategoryComponent } from './product/category/category.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { AddProductComponent } from './product/products-add/add-product.component';
import { ProductListComponent } from './product/products-list/product-list.component';
import { ProductssComponent } from './product/products-main-page/productss/productss.component';
import { ProductReviewsComponent } from './product/products-reviews/product-reviews/product-reviews.component';
import { SubCategoryComponent } from './product/sub-category/sub-category.component';


@NgModule({
  declarations: [
    CategoryComponent, 
    SubCategoryComponent, 
    ProductListComponent, 
    AddProductComponent, 
    DigitalCategoryComponent, 
    DigitalSubCategoryComponent, 
    DigitalAddComponent, 
    ProductDetailComponent, ProductssComponent, ProductReviewsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    NgbModule,
    GalleryModule,
    CKEditorModule,
    NgxDropzoneModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslateModule
  ],
  exports: [SubCategoryComponent],
  bootstrap: [SubCategoryComponent],
  providers: [
    NgbActiveModal
  ]
})
export class ProductsModule { }
