import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';
import { BlogService } from 'src/app/shared/service/blog.service';

@Component({
  selector: 'app-list-blog',
  templateUrl: './list-blog.component.html',
  styleUrls: ['./list-blog.component.scss']
})

export class ListBlogComponent implements OnInit {

  public blog_list = []

  constructor(
    private blogService: BlogService,
    private authService: AuthService
  ) { }

  deleteBlog(id) {
    this.blogService.deleteBlog(id).subscribe(
      (response) => {
        this.ngOnInit()
      },
      (error) => {
        console.error(error);
      }
    );
  }

  editBlog(id) {
    this.blogService.updateBlog(id, {}).subscribe(
      (response) => {
        this.ngOnInit()
      },
      (error) => {
        console.error(error);
      }
    );
  }

  truncateProductName(name: string, maxLength: number): string {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...';
    }
    return name;
  }

  ngOnInit() {
    this.authService.loadShop().subscribe(
      (shop) => {
        if (shop) {
          const id = shop.seller._id
          this.blogService.getBlog().subscribe(
            (response) => {
              this.blog_list = response.blogs
            },
            (error) => {
              console.error(error);
            }
          );
        }
      },
      (error) => {
        console.error('Kullanıcı kimliği belirleme hatası:', error);
      }
    );
  }
}
