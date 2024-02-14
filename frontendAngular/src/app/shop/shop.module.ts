import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSliderModule } from 'ngx-slider-v2';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../shared/shared.module';
import { ShopRoutingModule } from './shop-routing.module';

// Product Details Components
import { ProductSidebarComponent } from './product/product-sidebar/product-sidebar.component';

// Product Details Widgest Components
import { ServicesComponent } from './product/widgets/services/services.component';
import { CountdownComponent } from './product/widgets/countdown/countdown.component';
import { SocialComponent } from './product/widgets/social/social.component';
import { StockInventoryComponent } from './product/widgets/stock-inventory/stock-inventory.component';
import { RelatedProductComponent } from './product/widgets/related-product/related-product.component';

// Collection Components
import { CollectionSidebarComponent } from './collection/collection-sidebar/collection-sidebar.component';

// Collection Widgets
import { GridComponent } from './collection/widgets/grid/grid.component';
import { PaginationComponent } from './collection/widgets/pagination/pagination.component';
import { BrandsComponent } from './collection/widgets/brands/brands.component';
import { ColorsComponent } from './collection/widgets/colors/colors.component';
import { SizeComponent } from './collection/widgets/size/size.component';
import { PriceComponent } from './collection/widgets/price/price.component';

import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
// import { CompareComponent } from './compare/compare.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './checkout/success/success.component';

import { RouterModule } from '@angular/router';
import { AddressComponent } from './checkout/address/address.component';
import { ConfirmationComponent } from './checkout/confirmation/confirmation.component';
import { PaymentComponent } from './checkout/payment/payment.component';
import { CheckoutCartComponent } from './checkout/checkoutCart/checkout-cart.component';

@NgModule({
  declarations: [
    ProductSidebarComponent,

    ServicesComponent,
    CountdownComponent,
    SocialComponent,
    StockInventoryComponent,
    RelatedProductComponent,
    CollectionSidebarComponent,
    GridComponent,
    PaginationComponent,
    BrandsComponent,
    ColorsComponent,
    SizeComponent,
    PriceComponent,
    CartComponent,
    WishlistComponent,
    // CompareComponent,
    CheckoutComponent,
    SuccessComponent,
    AddressComponent,
    ConfirmationComponent,
    PaymentComponent,
    CheckoutCartComponent
  ],
  imports: [
    CommonModule,
    NgxSliderModule,
    InfiniteScrollModule,
    SharedModule,
    ShopRoutingModule,
    RouterModule
  ]
})
export class ShopModule { }
