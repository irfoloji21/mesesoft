import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductLeftSidebarComponent } from './product/product-sidebar/product-left-sidebar.component';
import { CollectionLeftSidebarComponent } from './collection/collection-left-sidebar/collection-left-sidebar.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './checkout/success/success.component';
import { Resolver } from '../shared/services/resolver.service';
import { CheckoutGuard } from '../pages/checkoutRoute.guard';
// import { FourImageComponent } from './product/four-image/four-image.component';
// import { BundleProductComponent } from './product/bundle-product/bundle-product.component';
// import { ImageOutsideComponent } from './product/image-outside/image-outside.component';
// import { CollectionRightSidebarComponent } from './collection/collection-right-sidebar/collection-right-sidebar.component';
// import { CollectionNoSidebarComponent } from './collection/collection-no-sidebar/collection-no-sidebar.component';
// import { CollectionInfinitescrollComponent } from './collection/collection-infinitescroll/collection-infinitescroll.component';
// import { CompareComponent } from './compare/compare.component';

const routes: Routes = [
  {
    path: 'product/:slug',
    component: ProductLeftSidebarComponent,
    resolve: {
      data: Resolver
    }
  },
  {
    path: 'collection',
    component: CollectionLeftSidebarComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'wishlist',
    component: WishlistComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [CheckoutGuard]
  },
  {
    path: 'checkout/success/:id',
    component: SuccessComponent
  },
  // {
  //   path: 'product/four/image/:slug',
  //   component: FourImageComponent,
  //   resolve: {
  //     data: Resolver
  //   }
  // },
  // {
  //   path: 'product/bundle/:slug',
  //   component: BundleProductComponent,
  //   resolve: {
  //     data: Resolver
  //   }
  // },
  // {
  //   path: 'product/image/outside/:slug',
  //   component: ImageOutsideComponent,
  //   resolve: {
  //     data: Resolver
  //   }
  // },
  // {
  //   path: 'collection/right/sidebar',
  //   component: CollectionRightSidebarComponent
  // },
  // {
  //   path: 'collection/no/sidebar',
  //   component: CollectionNoSidebarComponent
  // },
  // {
  //   path: 'collection/infinitescroll',
  //   component: CollectionInfinitescrollComponent
  // },

  // {
  //   path: 'compare',
  //   component: CompareComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
