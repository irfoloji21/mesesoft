import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAboutComponent } from './list-about/list-about.component';
import { CreateAboutComponent } from './create-about/create-about.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-about',
        component: ListAboutComponent,
        data: {
          title: "About Lists",
          breadcrumb: "About Lists"
        }
      },
      {
        path: 'create-about',
        component: CreateAboutComponent,
        data: {
          title: "Create About",
          breadcrumb: "Create About"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
