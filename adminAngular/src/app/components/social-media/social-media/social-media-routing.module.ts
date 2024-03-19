import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SocialMediaComponent } from './social-media.component';
import { AddSocialMediaComponent } from './add-social-media/add-social-media/add-social-media.component';


const routes: Routes = [
  {
    path: '',
    component: SocialMediaComponent,
    data: {
      title: "social-media",
      breadcrumb: "social-media"
    }
  },
  // {
  //   path: 'add-social-media',
  //   component: AddSocialMediaComponent 
  // },

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialMediaRoutingModule { }
