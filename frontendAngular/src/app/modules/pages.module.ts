import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { GalleryModule } from '@ks89/angular-modal-gallery';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';

// Pages Components
import { WishlistComponent } from './account/wishlist/wishlist.component';
import { DashboardComponent } from './account/dashboard/dashboard.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { ProfileComponent } from './account/profile/profile.component';
import { ContactComponent } from './contact/contact.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { ErrorComponent } from './error/error.component';
import { FaqComponent } from './faq/faq.component';

// Blog Components
import { BlogDetailsComponent } from './blog/blog-details.component';

// // Portfolio Components
import { ActivationComponent } from './account/activation/activation.component';
import { AccountInfoComponent } from './account/account-info/account-info.component';
import { AddressComponent } from './account/address/address.component';
import { CouponComponent } from './account/coupon/coupon.component';
import { OrderComponent } from './account/order/order.component';
import { SavedCardComponent } from './account/saved-card/saved-card.component';

@NgModule({
  declarations: [
    WishlistComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ProfileComponent,
    ContactComponent,
    AboutUsComponent,
    OrderSuccessComponent,
    ErrorComponent,
    FaqComponent,
    BlogDetailsComponent,
    ActivationComponent,
    AccountInfoComponent,
    ChangePasswordComponent,
    AddressComponent,
    CouponComponent,
    OrderComponent,
    SavedCardComponent
  ],
  imports: [
    CommonModule,
    GalleryModule,
    LightboxModule,
    SharedModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PagesModule { }
