import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlogRoutingModule } from './blog-routing.module';
import { ListBlogComponent } from './list-blog/list-blog.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ListBlogComponent, AddBlogComponent],
  imports: [
    CommonModule,
    BlogRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ]
})
export class BlogModule { }
