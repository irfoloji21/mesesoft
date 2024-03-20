import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialMediaRoutingModule } from './social-media-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddSocialMediaComponent } from './add-social-media/add-social-media/add-social-media.component';
import { SocialMediaComponent } from './social-media.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [AddSocialMediaComponent, SocialMediaComponent],
  imports: [
    CommonModule,
    SocialMediaRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule
  ]
})
export class SocialMediaModule { }
