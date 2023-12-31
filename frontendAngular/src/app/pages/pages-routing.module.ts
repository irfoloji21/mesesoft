import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WishlistComponent } from './account/wishlist/wishlist.component';
import { CartComponent } from './account/cart/cart.component';
import { DashboardComponent } from './account/dashboard/dashboard.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { ProfileComponent } from './account/profile/profile.component';
import { ContactComponent } from './account/contact/contact.component';
import { CheckoutComponent } from '../shop/checkout/checkout.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SearchComponent } from './search/search.component';
import { ReviewComponent } from './review/review.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { CollectionComponent } from './collection/collection.component';
import { ErrorComponent } from './error/error.component';
import { FaqComponent } from './faq/faq.component';
import { BlogLeftSidebarComponent } from './blog/blog-left-sidebar/blog-left-sidebar.component';
import { BlogDetailsComponent } from './blog/blog-details/blog-details.component';
import { AccountInfoComponent } from './account/account-info/account-info.component';
import { OrderComponent } from './account/order/order.component';
import { SavedCardComponent } from './account/saved-card/saved-card.component';
import { CouponComponent } from './account/coupon/coupon.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { AddressComponent } from './account/address/address/address.component';
import { CheckoutGuard } from './checkoutRoute.guard';
import { AuthGuard } from './route.guard';
// import { CompareOneComponent } from './compare/compare-one/compare-one.component';
// import { CompareTwoComponent } from './compare/compare-two/compare-two.component';
// import { LookbookComponent } from './lookbook/lookbook.component';
// import { ComingSoonComponent } from './coming-soon/coming-soon.component';
// import { GridTwoComponent } from './portfolio/grid-two/grid-two.component';
// import { GridThreeComponent } from './portfolio/grid-three/grid-three.component';
// import { GridFourComponent } from './portfolio/grid-four/grid-four.component';
// import { MasonryGridTwoComponent } from './portfolio/masonry-grid-two/masonry-grid-two.component';
// import { MasonryGridThreeComponent } from './portfolio/masonry-grid-three/masonry-grid-three.component';
// import { MasonryGridFourComponent } from './portfolio/masonry-grid-four/masonry-grid-four.component';
// import { MasonryFullWidthComponent } from './portfolio/masonry-full-width/masonry-full-width.component';
// import { AuthGuard } from './route.guard';
// import { CheckoutCartComponent } from '../shop/checkout/checkoutCart/checkout-cart/checkout-cart/checkout-cart.component';
// import { PaymentComponent } from '../shop/checkout/payment/payment/payment.component';
// import { TypographyComponent } from './typography/typography.component';
// import { BlogRightSidebarComponent } from './blog/blog-right-sidebar/blog-right-sidebar.component';
// import { BlogNoSidebarComponent } from './blog/blog-no-sidebar/blog-no-sidebar.component';

const routes: Routes = [
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'my-account', component: ProfileComponent },
      { path: 'address-book', component: AddressComponent },
      { path: 'my-orders', component: OrderComponent },
      { path: 'my-wishlist', component: WishlistComponent },
      { path: 'saved-card', component: SavedCardComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'coupon', component: CouponComponent },
      { path: '', redirectTo: 'my-account', pathMatch: 'full' },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'forget/password',
    component: ForgetPasswordComponent
  },
  {
    path: 'account-info',
    component: AccountInfoComponent,
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [CheckoutGuard],
    // children: [
    //   { path: 'checkout/address', component: AddressComponent, data: { step: 'adres' } },
    //   { path: 'checkout/checkout', component: CheckoutCartComponent, data: { step: 'checkout' } },
    //   { path: 'checkout/payment', component: PaymentComponent, data: { step: 'odeme' } },
    //   { path: '', redirectTo: 'checkout/address', pathMatch: 'full' },
    // ],
  },
  {
    path: 'aboutus',
    component: AboutUsComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'review',
    component: ReviewComponent
  },
  {
    path: 'order/success',
    component: OrderSuccessComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'collection',
    component: CollectionComponent
  },

  {
    path: '404',
    component: ErrorComponent
  },

  {
    path: 'faq',
    component: FaqComponent
  },
  {
    path: 'blog',
    component: BlogLeftSidebarComponent
  },
  {
    path: 'blog/details/:slug',
    component: BlogDetailsComponent
  },
  // { 
  //   path: 'portfolio/grid/two', 
  //   component: GridTwoComponent 
  // },
  // { 
  //   path: 'portfolio/grid/three', 
  //   component: GridThreeComponent 
  // },
  // { 
  //   path: 'portfolio/grid/four', 
  //   component: GridFourComponent 
  // },
  // { 
  //   path: 'portfolio/masonry/grid/two', 
  //   component: MasonryGridTwoComponent 
  // },
  // { 
  //   path: 'portfolio/masonry/grid/three', 
  //   component: MasonryGridThreeComponent 
  // },
  // { 
  //   path: 'portfolio/masonry/grid/four', 
  //   component: MasonryGridFourComponent 
  // },
  // { 
  //   path: 'portfolio/masonry/full-width', 
  //   component: MasonryFullWidthComponent 
  // },
  // { 
  //   path: 'account/wishlist', 
  //   component: WishlistComponent 
  // },
  // { 
  //   path: 'blog/right/sidebar', 
  //   component: BlogRightSidebarComponent 
  // },
  // { 
  //   path: 'blog/no/sidebar', 
  //   component: BlogNoSidebarComponent 
  // },
  // { 
  //   path: 'typography', 
  //   component: TypographyComponent 
  // },
  // {
  //   path: 'change/password',
  //   component: ChangePasswordComponent
  // },
  // { 
  //   path: 'profile', 
  //   component: ProfileComponent 
  // },
  // { 
  //   path: 'address', 
  //   component: AddressComponent 
  // },
  // { 
  //   path: 'compare/one', 
  //   component: CompareOneComponent 
  // },
  // { 
  //   path: 'compare/two', 
  //   component: CompareTwoComponent 
  // },
  // { 
  //   path: 'comingsoon', 
  //   component: ComingSoonComponent 
  // },
  // { 
  //   path: 'lookbook', 
  //   component: LookbookComponent 
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
