import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListBlogComponent } from './list-blog/list-blog.component';
import { AddBlogComponent } from './add-blog/add-blog.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-blog',
        component: ListBlogComponent,
        data: {
          title: "List Blogs",
          breadcrumb: "List Blogs"
        }
      },
      {
        path: 'add-blog',
        component: AddBlogComponent,
        data: {
          title: "Create Blog",
          breadcrumb: "Create Blogs"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
