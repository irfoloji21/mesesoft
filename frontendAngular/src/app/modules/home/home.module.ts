import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';

// Widgest Components
import { SliderComponent } from './widgets/slider/slider.component';
import { BlogComponent } from './widgets/blog/blog.component';
import { LogoComponent } from './widgets/logo/logo.component';
import { DiscountComponent } from './widgets/discount/discount.component';
import { ServicesComponent } from './widgets/services/services.component';
import { CollectionComponent } from './widgets/collection/collection.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FashionOneComponent } from '../home/fashion/fashion-one.component';

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
