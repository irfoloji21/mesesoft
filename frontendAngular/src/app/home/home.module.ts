import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { FashionOneComponent } from './fashion/fashion-one.component';

// Widgest Components
import { SliderComponent } from './widgets/slider/slider.component';
import { BlogComponent } from './widgets/blog/blog.component';
import { LogoComponent } from './widgets/logo/logo.component';
import { DiscountComponent } from './widgets/discount/discount.component';
import { ServicesComponent } from './widgets/services/services.component';
import { CollectionComponent } from './widgets/collection/collection.component';

@NgModule({
  declarations: [
    FashionOneComponent,
    SliderComponent,
    BlogComponent,
    LogoComponent,
    DiscountComponent,
    ServicesComponent,
    CollectionComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
