import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WishlistComponent } from './account/wishlist/wishlist.component';
import { DashboardComponent } from './account/dashboard/dashboard.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { ProfileComponent } from './account/profile/profile.component';
import { ContactComponent } from './contact/contact.component';
import { CheckoutComponent } from '../shop/checkout/checkout.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { ErrorComponent } from './error/error.component';
import { FaqComponent } from './faq/faq.component';
import { BlogDetailsComponent } from './blog/blog-details.component';
import { AccountInfoComponent } from './account/account-info/account-info.component';
import { OrderComponent } from './account/order/order.component';
import { SavedCardComponent } from './account/saved-card/saved-card.component';
import { CouponComponent } from './account/coupon/coupon.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { AddressComponent } from './account/address/address.component';
import { CheckoutGuard } from './checkoutRoute.guard';
import { AuthGuard } from './route.guard';
// import { AuthGuard } from './route.guard';
// import { CheckoutCartComponent } from '../shop/checkout/checkoutCart/checkout-cart.component';
// import { PaymentComponent } from '../shop/checkout/payment/payment.component';

const routes: Routes = [
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
    path: 'order/success',
    component: OrderSuccessComponent,
    canActivate: [AuthGuard],
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
    path: 'blog/details/:slug',
    component: BlogDetailsComponent
  },
  // { 
  //   path: 'account/wishlist', 
  //   component: WishlistComponent 
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
